package net.karazy.cloobster;

import org.apache.cordova.DroidGap;

import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

public class CloobsterApp extends DroidGap {
	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.setIntegerProperty("splashscreen", R.drawable.splash);
		super.loadUrl("file:///android_asset/www/index.html", 5000);
	}
}