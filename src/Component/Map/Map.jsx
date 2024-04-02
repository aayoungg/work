/* eslint-disable */
import React, { useEffect, useRef } from "react";

function Map({ isInCircleState }) {
  const mapRef = useRef(null);
  console.log("mapRef", mapRef);
  const [isInCircle, setIsInCircle] = isInCircleState;

  useEffect(() => {
    const mapDiv = mapRef.current;

    let centerLocation;
    let initialZoom = 19;

    const loadMap = () => {
      if (window.naver && window.naver.maps) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              const userLocation = new window.naver.maps.LatLng(
                latitude,
                longitude
              );

              var radius = 200;

              centerLocation = userLocation;

              const mapInstance = new window.naver.maps.Map(mapDiv, {
                center: centerLocation,
                zoom: initialZoom,
              });

              const marker = new window.naver.maps.Marker({
                position: userLocation,
                map: mapInstance,
              });

              const circle = new window.naver.maps.Circle({
                map: mapInstance,
                center: { y: 37.535736167135774, x: 127.06496506279134 },
                radius: radius,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
              });

              const isInCircle = isMarkerInCircle(marker, circle);
              setIsInCircle(isInCircle);
            },
            (error) => {
              console.error("오류 발생: " + error.message);
              const defaultLocation = new window.naver.maps.LatLng(
                37.5665,
                126.978
              );
              const mapInstance = new window.naver.maps.Map(mapDiv, {
                center: defaultLocation,
                zoom: initialZoom,
              });
            }
          );
        }
      } else {
        setTimeout(loadMap, 1000);
      }
    };

    loadMap();
  }, []);

  const isMarkerInCircle = (marker, circle) => {
    const markerPosition = marker.getPosition();
    const circleCenter = circle.getCenter();
    const circleRadius = circle.getRadius();

    const distance =
      getDistanceBetweenPoints(
        markerPosition.y,
        markerPosition.x,
        circleCenter.y,
        circleCenter.x
      ) * 1000;

    return distance <= circleRadius;
  };

  const getDistanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  return (
    <div>
      <div ref={mapRef} id="map" style={{ width: "40vw", height: "60vh" }} />
    </div>
  );
}

export default Map;
