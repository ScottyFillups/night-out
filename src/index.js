import songUrl from './song.mp3'
import axios from 'axios'

const $ = (slt) => document.querySelector(slt)

const audioCtx = new AudioContext()
const source = audioCtx.createBufferSource()
const req = {
  responseType: 'arraybuffer',
  url: songUrl,
  method: 'get'
}

axios.request(req).then((res) => {
  audioCtx.decodeAudioData(res.data).then((buffer) => {
    source.buffer = buffer
    source.connect(audioCtx.destination)
    source.start()
  })
})
