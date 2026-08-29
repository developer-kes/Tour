export {};

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (
          container: HTMLElement,
          options: { center: unknown; level: number },
        ) => unknown;
        Marker: new (options: {
          position: unknown;
          map?: unknown;
          image?: unknown;
        }) => { setMap: (map: unknown) => void };
        MarkerImage: new (src: string, size: unknown) => unknown;
        Size: new (width: number, height: number) => unknown;
        InfoWindow: new (options: { content: string }) => {
          open: (map: unknown, marker: unknown) => void;
        };
        event: {
          addListener: (
            target: unknown,
            type: string,
            handler: () => void,
          ) => void;
        };
      };
    };
  }
}
