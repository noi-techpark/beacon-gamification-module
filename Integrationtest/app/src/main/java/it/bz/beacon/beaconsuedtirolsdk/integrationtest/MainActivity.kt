package it.bz.beacon.beaconsuedtirolsdk.integrationtest

import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.widget.Button
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import it.bz.beacon.beaconsuedtirolsdk.integrationtest.MyReactActivity.QUEST_LOCALE
import it.bz.beacon.beaconsuedtirolsdk.integrationtest.MyReactActivity.USER_EMAIL


class MainActivity : AppCompatActivity() {

    private val OVERLAY_PERMISSION_REQ_CODE = 1212

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

/*        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.canDrawOverlays(this)) {
                val intent = Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:$packageName")
                )
                startActivityForResult(intent, OVERLAY_PERMISSION_REQ_CODE)
            }
        }*/

        val clickButton = findViewById<Button>(R.id.button)
        clickButton.setOnClickListener {
            val intent = Intent(this@MainActivity, MyReactActivity::class.java)
            // you can pass parameter "de" for Deutsch quest or "it" for Italian quest
            intent.putExtra(QUEST_LOCALE, "de")
            // email of logged user
            intent.putExtra(USER_EMAIL, "radghiv@gmail.com")
            startActivity(intent)
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode == OVERLAY_PERMISSION_REQ_CODE) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.canDrawOverlays(this)) {
                    Toast.makeText(
                        this,
                        "You cannot open the React Native app as you have denied the permission",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
        }
    }
}
