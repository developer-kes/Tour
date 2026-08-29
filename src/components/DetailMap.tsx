'use client';

/* REACT */
import { useEffect } from 'react';

/* 카카오맵에 필요한 데이터 타입 */
interface KakaoMapProps {
  mapX: string;
  mapY: string;
  title: string;
}

export default function KakaoMap({ mapX, mapY, title }: KakaoMapProps) {
  /* return 로드 후 useEffect 코드 실행 (카드마다 데이터가 다르기 때문에 mapX와 mapY가 바뀔 때 마다 실행) */
  useEffect(() => {
    /* 카카오 지도 스크립트 비동기로 불러옴 */
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    /* 카카오 SDK 다운 후 실행 코드 */
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        if (!container) return;
        const options = {
          /* 문자열이기 때문에 위도와 경도를 Number로 형변환 */
          center: new window.kakao.maps.LatLng(Number(mapY), Number(mapX)),
          level: 3,
        };

        const map = new window.kakao.maps.Map(container, options);

        const markerPosition = new window.kakao.maps.LatLng(
          Number(mapY),
          Number(mapX),
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };
  }, [mapX, mapY]);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '350px',
        borderRadius: '12px',
        marginTop: '20px',
        backgroundColor: '#eee',
      }}
    />
  );
}
