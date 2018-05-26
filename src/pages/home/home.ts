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

  _mediaPath: string
  Msg: string
  mediaObj: MediaObject;
  isplaying: boolean;
  isLoad: boolean;
  currentPoint: any;
  duration: string;
  fileList: any;
  fileName: string;
  constructor(
    public navCtrl: NavController,
    private fileChooser: FileChooser,
    private statusBar: StatusBar,
    private filePath: FilePath,
    private media: Media,
    private file: File
  ) {
    this.isplaying = false;
    this.isLoad = false;
    this.duration = '0';
  }
  async ngOnInit() {
    let listDir = await this.file.listDir('file:///storage/emulated/0/', 'Download');
    let files = [];
    for (let list of listDir) {
      if (!list.isDirectory) {
        var re = /(?:\.([^.]+))?$/;
        var ext = re.exec(list.name)[1];
        if (ext == 'mp3') {
          files.push({ name: list.name, nativeURL: list.nativeURL })
        }
      }
    }
    this.fileList = files;

  }


  initialsetting() {
    this.statusBar.overlaysWebView(true);
    this.statusBar.backgroundColorByHexString('#ffffff');
  }

  async openFile() {

    let uri = await this.fileChooser.open();

    this.initMedia(uri);
  }

  async initMedia(uri) {

    if (this.mediaObj) this.mediaObj.release();

    let url = await this.filePath.resolveNativePath(uri);

    let fileInfo = await this.file.resolveLocalFilesystemUrl(url);

    this._mediaPath = url.replace(/file:\/\//g, '');

    this.mediaObj = this.media.create(this._mediaPath);

    this.mediaObj.play();

    this.mediaObj.setVolume(1);

    this.currentPoint = 0;

    this.fileName = fileInfo.name;
    
    setTimeout(() => {
      this.duration = Math.round(this.mediaObj.getDuration()).toString();
      console.log(this.duration)
    }, 30);

    setInterval(async () => {
      this.currentPoint = Math.round(await this.mediaObj.getCurrentPosition());
    }, 1000)
    this.Msg = "Media Playing"

    this.isplaying = true;

    this.isLoad = true;
  }

  playMedia() {
    if (!this._mediaPath) {
      this.Msg = "Please Select audio file"
      return;
    }

    if (this.isplaying) {
      this.pause();
    } else {
      this.play();
    }
    this.isplaying = !this.isplaying;

  }

  play() {
    this.mediaObj.play();
    this.Msg = "Media Playing"
  }

  pause() {
    this.mediaObj.pause();
    this.Msg = "Media Paused!"
  }

  setPoint() {
    if (!this.mediaObj) return;
    this.restrictValue();
    this.mediaObj.seekTo(this.currentPoint * 1000)
  }

  restrictValue() {
    if (this.currentPoint > this.duration) {
      this.currentPoint = this.duration;
    }
  }

  listClick(i) {
    this.initMedia(this.fileList[i].nativeURL)
  }
}
