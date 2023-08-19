import { RightArrow, LeftArrow } from "@/utils/icons";
import { Swiper } from "swiper/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function SwipperWrapper(props) {
  const { children, spaceBetween = 1, slidesPerView = 1, loop = true } = props;
  const [showNav, setShowNav] = useState(false);
  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  function loaded(params) {
    setShowNav(params?.slides?.length > slidesPerView);
  }

  return (
    <div className="relative">
      <Swiper
        spaceBetween={spaceBetween}
        ref={sliderRef}
        slidesPerView={slidesPerView}
        loop={loop}
        onInit={loaded}
      >
        {children}
      </Swiper>
      {showNav && (
        <>
          <div className="carousel-btn left" onClick={handlePrev}>
            <LeftArrow />
          </div>
          <div className="carousel-btn right" onClick={handleNext}>
            <RightArrow />
          </div>
        </>
      )}
    </div>
  );
}
