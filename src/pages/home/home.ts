import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FileChooser } from '@ionic-native/file-chooser';
import { StatusBar } from '@ionic-native/status-bar';
import { FilePath } from '@ionic-native/file-path';
// import { File, IFile, Entry } from '@ionic-native/file';

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
    // private file: File
  ) {

  }

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
              console.log(result);
            })
        })

      })
      .catch(e => console.log(JSON.stringify(e)));
  }

}
