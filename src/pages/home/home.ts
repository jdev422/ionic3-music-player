import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { StatusBar } from '@ionic-native/status-bar';
import { FilePath } from '@ionic-native/file-path';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private fileChooser: FileChooser,
    private statusBar: StatusBar,
    private filePath: FilePath,
    private media: Media,
    private file: File
  ) {

  }

  _mediaPath: string
  Msg: string
  mediaObj: MediaObject;
  initialsetting() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#ffffff');
  }

  openFile() {
    this.fileChooser.open()
      .then((uri) => {
        this.fileChooser.open().then((url) => {
          this.filePath.resolveNativePath(url)
            .then((result) => {
              this.file.resolveLocalFilesystemUrl(result)
                .then(res => {
                  console.log(JSON.stringify(res))
                })
              result = result.replace(/file:\/\//g, '')
              this._mediaPath = result;
              console.log(result);
            })
        })

      })
      .catch(e => console.log(JSON.stringify(e)));
  }

  playMedia() {
    if (!this._mediaPath) {
      this.Msg = "Please Select audio file"
      return;
    }

    this.mediaObj = this.media.create(this._mediaPath);

    this.mediaObj.play();
    this.mediaObj.setVolume(1)
    // this.setupMediaTimerProgressbar()
    // get current playback position
    this.mediaObj.getCurrentPosition().then((position) => {
      console.log('*** current position ***', position);
    });

    // get file duration
    let duration = this.mediaObj.getDuration();
    console.log('=== file duration ===', duration);
    console.log(this._mediaPath)

    this.Msg = "Media Playing"
  }

}
