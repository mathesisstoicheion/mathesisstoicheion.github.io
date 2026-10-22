package com.mathesisstoicheion.reader;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * Beta updates. When the app opens (and when it comes back after some hours), it asks GitHub for the newest beta
 * (the release "app-beta-N", published from branch android-beta-signed). If N is newer than this app, it offers it:
 * one tap downloads it, and Android's installer opens to put it over this one, keeping everything saved in the app.
 */
class BetaUpdates {
    private static final String LATEST = "https://api.github.com/repos/mathesisstoicheion/mathesisstoicheion.github.io/releases/latest";
    private static final String APK = "application/vnd.android.package-archive";
    private static final long EVERY = 6 * 60 * 60 * 1000L; // ask again after six hours away

    private final Activity app;
    private final SharedPreferences prefs;
    private boolean asking;

    BetaUpdates(Activity app, SharedPreferences prefs) {
        this.app = app;
        this.prefs = prefs;
    }

    /** This app's beta number (its versionCode, the build's number on GitHub). */
    @SuppressWarnings("deprecation")
    private long thisBeta() {
        try {
            android.content.pm.PackageInfo p = app.getPackageManager().getPackageInfo(app.getPackageName(), 0);
            return Build.VERSION.SDK_INT >= 28 ? p.getLongVersionCode() : p.versionCode;
        } catch (PackageManager.NameNotFoundException e) {
            return Long.MAX_VALUE;
        }
    }

    /** Asks GitHub, unless it was asked lately (or `now`). Quietly does nothing when offline. */
    void check(boolean now) {
        long last = prefs.getLong("betaChecked", 0), t = System.currentTimeMillis();
        if (asking || (!now && t - last < EVERY)) return;
        asking = true;
        new Thread(() -> {
            try {
                HttpURLConnection c = (HttpURLConnection) new URL(LATEST).openConnection();
                c.setRequestProperty("Accept", "application/vnd.github+json");
                c.setConnectTimeout(8000);
                c.setReadTimeout(8000);
                if (c.getResponseCode() != 200) return;
                JSONObject r = new JSONObject(read(c.getInputStream()));
                prefs.edit().putLong("betaChecked", t).apply();
                String tag = r.optString("tag_name", "");
                if (!tag.startsWith("app-beta-")) return;
                long beta = Long.parseLong(tag.substring("app-beta-".length()));
                if (beta <= thisBeta()) return;
                String url = null;
                JSONArray assets = r.optJSONArray("assets");
                for (int i = 0; assets != null && i < assets.length(); i++) {
                    JSONObject a = assets.getJSONObject(i);
                    if ("mathesis.apk".equals(a.optString("name"))) url = a.optString("browser_download_url");
                }
                if (url == null) return;
                String notes = r.optString("body", "").trim(), link = url;
                app.runOnUiThread(() -> offer(beta, notes, link));
            } catch (Exception ignored) {
                // offline, or GitHub did not answer: ask again next time
            } finally {
                asking = false;
            }
        }).start();
    }

    private void offer(long beta, String notes, String url) {
        if (app.isFinishing()) return;
        new AlertDialog.Builder(app, android.R.style.Theme_Material_Dialog_Alert)
                .setTitle("Beta " + beta + " is ready")
                .setMessage((notes.isEmpty() ? "" : notes + "\n\n") + "It installs over this one and keeps your reading, notes and sign-in.")
                .setPositiveButton("Update", (d, w) -> download(beta, url))
                .setNegativeButton("Later", null)
                .show();
    }

    private void download(long beta, String url) {
        // Android asks once to let this app install updates
        if (Build.VERSION.SDK_INT >= 26 && !app.getPackageManager().canRequestPackageInstalls()) {
            Toast.makeText(app, "Allow Mathesis to install updates, then come back and tap Update again.", Toast.LENGTH_LONG).show();
            app.startActivity(new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + app.getPackageName())));
            prefs.edit().putLong("betaChecked", 0).apply(); // offer it again on return
            return;
        }
        File old = new File(app.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS), "mathesis-beta-" + beta + ".apk");
        if (old.exists()) old.delete();
        DownloadManager dm = (DownloadManager) app.getSystemService(Context.DOWNLOAD_SERVICE);
        long id = dm.enqueue(new DownloadManager.Request(Uri.parse(url))
                .setTitle("Mathesis beta " + beta)
                .setMimeType(APK)
                .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE)
                .setDestinationInExternalFilesDir(app, Environment.DIRECTORY_DOWNLOADS, "mathesis-beta-" + beta + ".apk"));
        Toast.makeText(app, "Downloading beta " + beta + "…", Toast.LENGTH_SHORT).show();
        Context ctx = app.getApplicationContext();
        BroadcastReceiver done = new BroadcastReceiver() {
            @Override
            public void onReceive(Context c, Intent i) {
                if (i.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1) != id) return;
                ctx.unregisterReceiver(this);
                Uri file = dm.getUriForDownloadedFile(id);
                if (file == null) {
                    Toast.makeText(ctx, "The download didn't finish. Try again later.", Toast.LENGTH_LONG).show();
                    return;
                }
                Intent install = new Intent(Intent.ACTION_VIEW).setDataAndType(file, APK)
                        .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                ctx.startActivity(install);
            }
        };
        IntentFilter f = new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE);
        if (Build.VERSION.SDK_INT >= 33) ctx.registerReceiver(done, f, Context.RECEIVER_EXPORTED);
        else ctx.registerReceiver(done, f);
    }

    private static String read(InputStream in) throws java.io.IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] b = new byte[8192];
        for (int n; (n = in.read(b)) > 0; ) out.write(b, 0, n);
        in.close();
        return out.toString("UTF-8");
    }
}
