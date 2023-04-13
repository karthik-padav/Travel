import { Carousel } from "@trendyol-js/react-carousel";
import { RightArrow, LeftArrow } from "@/utils/icons";

export default function CarouselWrapper(props) {
  const { show = 3.5, slide = 2, transition = 0.5, children } = props;
  return (
    <Carousel
      show={show}
      slide={slide}
      transition={transition}
      responsive={true}
      swiping={true}
      className="cursor-default"
      rightArrow={
        <button className="carousel-btn right">
          <RightArrow />
        </button>
      }
      leftArrow={
        <button className="carousel-btn left">
          <LeftArrow />
        </button>
      }
    >
      {children}
    </Carousel>
  );
}
