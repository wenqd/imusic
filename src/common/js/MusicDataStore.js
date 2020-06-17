const Store = require('electron-store')
const path = require('path')
const {v4: uuidv4 } = require('uuid')
const NodeID3 = require('node-id3')
const fs = require('fs')
class DataStore extends Store {
    constructor(settings){
        super(settings)
        this.tracks = this.get('tracks')||[]
    }
    saveTracks(){
        this.set('tracks',this.tracks)
        return this
    }
    getTracks(){
        return this.get('tracks')||[]
    }
    deleteTrack(deleteId){
        this.tracks = this.tracks.filter(item =>item.id!==deleteId)
        return this.saveTracks()
    }
    addTracks(tracks){
        const tracksWithProps = tracks.map(track=>{
            let data = fs.readFileSync(track);
            let tags = NodeID3.read(data)
            return {
                id:uuidv4(),
                fileName:path.basename(track),
                filePath:track,
                album:tags.album,
                artist:tags.artist,
                title:tags.title
            }
        }).filter(track=>{
            const currTrackPath = this.getTracks().map(track=>{
                return track.filePath
            });
            return currTrackPath.indexOf(track.filePath)<0
        })
        this.tracks = [...this.tracks,...tracksWithProps]
        return this.saveTracks();
    }
}
module.exports = DataStore