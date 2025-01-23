import {
  component$,
  $,
  useOnDocument,
  useStore,
  noSerialize,
  useTask$,
} from "@builder.io/qwik";
import Peer from "peerjs";
import { inlineTranslate } from 'qwik-speak';
import Select from "~/components/atoms/Inputs/Select";

interface PeerProps {
  userId: string;
  remoteId?: string;
}

export default component$((props: PeerProps) => {
  const t = inlineTranslate();
  const store = useStore({
    peer: null as any,
    conn: null as any,
    getUserMedia: null as any,
    cameras: [] as Array<any>,
    selectedCamera: null as any,
  });

  const initPeer = $(() => {
    store.peer = noSerialize(new Peer(props.userId));
  });

  const initLocalVideo = $(async () => {
    const videoElement = document.getElementById("myVideo") as HTMLVideoElement;
    const video = store.selectedCamera
      ? { deviceId: { exact: store.selectedCamera } }
      : true;

    await navigator.mediaDevices
      .getUserMedia({ video, audio: false })
      .then((stream: MediaStream) => {
        videoElement.srcObject = stream;
      });
  });

  const selectCamera = $((event: Event) => {
    const target = event.target as HTMLSelectElement;
    store.selectedCamera = target.value;
    initLocalVideo();
  });

  const getCameras = $(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput",
      );

      store.cameras = videoDevices.map((device: any) => {
        return {
          id: device.deviceId,
          name: device.label,
        };
      });
      store.selectedCamera = store.cameras[0].id;
      initLocalVideo();
    } catch (error) {
      console.error("Errore nel recupero dei dispositivi:", error);
    }
  });

  const connectToPeer = $(() => {
    store.conn = store.peer.connect(props.remoteId);
    console.log(store.conn, "connectToPeer");

    store.conn.on("open", () => {
      console.log("My peer ID is: " + store.peer.id);
    });

    store.peer.on("connection", (conn: any) => {
      conn.on("data", (data: any) => {
        console.log(data);
      });
    });

    store.peer.on("call", (call: any) => {
      store.getUserMedia(
        { video: true, audio: false },
        (stream: MediaStream) => {
          call.answer(stream);
          call.on("stream", (remoteStream: MediaStream) => {
            console.log(remoteStream);
          });
        },
        function (err: any) {
          console.log("Failed to get remote stream", err);
        },
      );
    });
  });

  useOnDocument(
    "qinit",
    $(async () => {
      initPeer();
      getCameras();
    }),
  );

  useTask$(({ track }) => {
    // Watch remoteId
    const newRemoteId = track(() => props.remoteId);

    if (newRemoteId) {
      connectToPeer();
    }
  });

  return (
    <div class="local-video">
      <video id="myVideo" autoplay playsInline />
      { store.cameras.length > 0 && (
        <Select
          options={ store.cameras }
          onInput={ selectCamera }
          label={ t('Choose a camera') }
          name="voice"
        />
      ) }
    </div>
  );
});
