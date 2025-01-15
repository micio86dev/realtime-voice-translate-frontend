import {
  component$,
  useVisibleTask$,
  Slot,
} from "@builder.io/qwik";
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface DaysProps {
  id?: string;
  onChange: any;
  selectedIndex: number;
}

export default component$((props: DaysProps) => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const elements = Array.from(document.getElementsByClassName('swiper'));
    elements.forEach((el: any) => {
      if (el.id === props.id || !props.id) {
        const swiper = new Swiper(el, {
          modules: [Navigation, Pagination],
          speed: 400,
          spaceBetween: 0,
          initialSlide: props.selectedIndex,
          slidesPerView: 1,
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
          },
        });

        const currentIndex = track(() => props.selectedIndex);

        swiper.slideTo(currentIndex, 400);
        swiper.on('slideChange', function () {
          props.onChange(swiper.activeIndex);
        });
      }
    });
  })

  return (
    <div id={ props.id } class="swiper">
      <div class="swiper-wrapper">
        <Slot />
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-scrollbar"></div>
    </div>
  );
})