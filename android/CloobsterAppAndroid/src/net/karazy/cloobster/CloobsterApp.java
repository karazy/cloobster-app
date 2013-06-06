package net.karazy.cloobster;

import org.apache.cordova.DroidGap;

import android.content.Intent;
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
		super.loadUrl("file:///android_asset/www/index.html", 10000);
	}
//	
//	@Override
//	public void startActivity(Intent intent, Bundle bundle) {
//		super.startActivity(intent);
//		System.out.println("starting Activity");
//		Bundle params = intent.getExtras();
//		String spot = params.get("spot").toString();
//		
//		if(spot != null && spot.length() > 0) {
//			System.out.println("Found spot " + spot);
//		}
//	}
	
	
}