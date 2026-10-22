package com.mathesisstoicheion.reader;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.AssetManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowManager;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import androidx.webkit.WebViewAssetLoader;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * The site in an app. The whole site (the static export in web/out) is inside the app, and is shown at
 * its real address, https://mathesisstoicheion.com/, so sign-in and saved reading work as on the web.
 * Anything not inside the app (the word packs under /packs/) is fetched from the internet as usual.
 */
public class MainActivity extends Activity {
    static final String HOST = "mathesisstoicheion.com";
    static final String HOME = "https://" + HOST + "/";

    private WebView web;
    private FrameLayout frame;
    private WebViewAssetLoader loader;
    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle saved) {
        super.onCreate(saved);
        prefs = getSharedPreferences("reader", MODE_PRIVATE);

        loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/", new SiteFiles(getAssets()))
                .build();

        // the site's offline helper (sw.js) and what it fetches come from the app too
        ServiceWorkerController.getInstance().setServiceWorkerClient(new ServiceWorkerClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }
        });

        edgeToEdge();

        web = new WebView(this);
        web.setBackgroundColor(0xFF14100D);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setTextZoom(100);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri u = request.getUrl();
                if ("https".equals(u.getScheme()) && HOST.equals(u.getHost())) return false;
                // other sites (GitHub, Wiktionary, mail links) open in the phone's own apps
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, u));
                } catch (ActivityNotFoundException ignored) {
                }
                return true;
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                checkSafeAreas();
            }
        });
        frame = new FrameLayout(this);
        frame.addView(web);
        frame.setOnApplyWindowInsetsListener((v, insets) -> {
            readInsets(insets);
            fitFrame();
            return insets; // passed on unchanged, so the page itself learns where the clock and gesture bar are
        });
        setContentView(frame);

        if (saved != null) web.restoreState(saved);
        else web.loadUrl(prefs.getString("last", HOME));
    }

    // ---- full screen: the page runs under the clock and the gesture bar ----

    /** Where the system bars and the camera hole are, and how tall the keyboard is (in screen pixels). */
    private int barTop, barBottom, keyboard;
    /** True when this phone's WebView doesn't tell the page about the bars, so the app keeps the page clear of them. */
    private boolean keepClear;

    private void edgeToEdge() {
        android.view.Window w = getWindow();
        if (Build.VERSION.SDK_INT >= 30) {
            w.setDecorFitsSystemWindows(false);
        } else {
            w.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION);
        }
        w.setStatusBarColor(0);
        w.setNavigationBarColor(0);
        if (Build.VERSION.SDK_INT >= 29) {
            w.setNavigationBarContrastEnforced(false);
            w.setStatusBarContrastEnforced(false);
        }
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams a = w.getAttributes();
            a.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            w.setAttributes(a);
        }
    }

    @SuppressWarnings("deprecation")
    private void readInsets(WindowInsets insets) {
        if (Build.VERSION.SDK_INT >= 30) {
            android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
            barTop = bars.top;
            barBottom = bars.bottom;
            keyboard = insets.isVisible(WindowInsets.Type.ime()) ? insets.getInsets(WindowInsets.Type.ime()).bottom : 0;
        } else {
            barTop = insets.getSystemWindowInsetTop();
            barBottom = insets.getSystemWindowInsetBottom();
            keyboard = barBottom > barTop * 3 ? barBottom : 0; // older Android reports the keyboard as a tall bottom bar
        }
    }

    /** Lifts the page above the keyboard, and keeps it clear of the bars only when the page can't do it itself. */
    private void fitFrame() {
        int top = keepClear ? barTop : 0;
        int bottom = keyboard > 0 ? keyboard : (keepClear ? barBottom : 0);
        if (frame.getPaddingTop() != top || frame.getPaddingBottom() != bottom) frame.setPadding(0, top, 0, bottom);
    }

    /** The site places its header below the clock using the phone's safe areas; checks the page is told them. */
    private void checkSafeAreas() {
        if (barTop == 0) return;
        String probe = "(function(){var d=document.createElement('div');"
                + "d.style.cssText='position:fixed;top:0;left:0;width:1px;visibility:hidden;pointer-events:none;height:env(safe-area-inset-top,0px)';"
                + "document.documentElement.appendChild(d);var h=d.getBoundingClientRect().height;d.remove();return h;})()";
        web.evaluateJavascript(probe, value -> {
            boolean told;
            try {
                told = Double.parseDouble(value) > 0;
            } catch (NumberFormatException e) {
                told = false;
            }
            if (keepClear == !told) return;
            keepClear = !told;
            fitFrame();
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        // reopen where the reader left off
        String url = web.getUrl();
        if (url != null && url.startsWith(HOME)) prefs.edit().putString("last", url).apply();
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    /** Finds a page or file of the site inside the app, the way GitHub Pages does: /library → library.html. */
    static class SiteFiles implements WebViewAssetLoader.PathHandler {
        private static final Map<String, String> TYPES = new HashMap<>();
        static {
            TYPES.put("html", "text/html");
            TYPES.put("js", "text/javascript");
            TYPES.put("mjs", "text/javascript");
            TYPES.put("css", "text/css");
            TYPES.put("json", "application/json");
            TYPES.put("webmanifest", "application/manifest+json");
            TYPES.put("txt", "text/plain");
            TYPES.put("xml", "application/xml");
            TYPES.put("svg", "image/svg+xml");
            TYPES.put("png", "image/png");
            TYPES.put("jpg", "image/jpeg");
            TYPES.put("jpeg", "image/jpeg");
            TYPES.put("webp", "image/webp");
            TYPES.put("gif", "image/gif");
            TYPES.put("ico", "image/x-icon");
            TYPES.put("woff", "font/woff");
            TYPES.put("woff2", "font/woff2");
            TYPES.put("ttf", "font/ttf");
            TYPES.put("otf", "font/otf");
            TYPES.put("mp3", "audio/mpeg");
            TYPES.put("ogg", "audio/ogg");
            TYPES.put("wav", "audio/wav");
            TYPES.put("wasm", "application/wasm");
            TYPES.put("gz", "application/gzip");
        }

        private final AssetManager assets;

        SiteFiles(AssetManager assets) {
            this.assets = assets;
        }

        @Override
        public WebResourceResponse handle(String path) {
            String[] tries = path.isEmpty() || path.endsWith("/")
                    ? new String[]{path + "index.html"}
                    : new String[]{path, path + ".html", path + "/index.html"};
            for (String p : tries) {
                InputStream in;
                try {
                    in = assets.open("site/" + p);
                } catch (IOException notHere) {
                    continue;
                }
                String type = typeOf(p);
                boolean text = type.startsWith("text/") || type.endsWith("json") || type.endsWith("xml");
                return new WebResourceResponse(type, text ? "utf-8" : null, in);
            }
            return null; // not in the app: fetched from the internet
        }

        private static String typeOf(String p) {
            int dot = p.lastIndexOf('.');
            String t = dot < 0 ? null : TYPES.get(p.substring(dot + 1).toLowerCase());
            return t != null ? t : "application/octet-stream";
        }
    }
}
