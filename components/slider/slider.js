import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import anime from 'animejs';
import s from './slider.css';
import { log } from 'util';

// From https://davidwalsh.name/javascript-debounce-function.
function debounce(func, wait, immediate) {
  let timeout;

  return () => {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

class Slider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animation: {
        slides: {
          duration: 600,
          easing: 'easeOutQuint',
        },
        shape: {
          duration: 300,
          easing: { in: 'easeOutQuint', out: 'easeOutQuad' },
        },
      },
      current: 0,
      slideshow: null,
      slides: null,
      rect: null,
      shape: null,
      frameFill: '#f1f1f1',
      frameSize: 0,
      paths: null,
      dir: 'next',
    };

    this.nextSlide = this.nextSlide.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      const rect = this.slideshow.getBoundingClientRect();
      this.setState(
        {
          rect,
          slideshow: this.slideshow,
          slides: this.slides,
          frameSize: rect.width / 14,
        },
        () => {
          this.createFrame();
        }
      );

      window.addEventListener(
        'resize',
        debounce(() => {
          this.setState({ rect: this.slideshow.getBoundingClientRect() });
          this.updateFrame();
        }, 20)
      );
      document.addEventListener('keydown', this.handleKeyDown, true);
    }, 0);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  createFrame() {
    const { rect, frameFill, slideshow } = this.state;
    const frameSize = rect.width / 14;
    const paths = {
      initial: this.calculatePath('initial'),
      final: this.calculatePath('final'),
    };
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'shape');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('class', s.svgFrame);
    svg.setAttribute('viewbox', `0 0 ${rect.width} ${rect.height}`);
    svg.innerHTML = `<path fill="${frameFill}" d="${paths.initial}"/>`;
    slideshow.insertBefore(svg, this.slidenav);
    const shape = svg.querySelector('path');

    this.setState({ shape, svg, frameSize, paths });
  }

  updateFrame() {
    const { paths, svg, shape, isAnimating, rect } = this.state;
    paths.initial = this.calculatePath('initial');
    paths.final = this.calculatePath('final');
    svg.setAttribute('viewbox', `0 0 ${rect.width} ${rect.height}`);
    shape.setAttribute('d', this.isAnimating ? paths.final : paths.initial);
  }

  calculatePath(path = 'initial') {
    const { rect, frameSize } = this.state;

    return path === 'initial'
      ? `M 0,0 0,${rect.height} ${rect.width},${rect.height} ${rect.width},0 0,0 Z M 0,0 ${
          rect.width
        },0 ${rect.width},${rect.height} 0,${rect.height} Z`
      : `M 0,0 0,${rect.height} ${rect.width},${rect.height} ${
          rect.width
        },0 0,0 Z M ${frameSize},${frameSize} ${rect.width - frameSize},${frameSize} ${rect.width -
          frameSize},${rect.height - frameSize} ${frameSize},${rect.height - frameSize} Z`;
  }

  handleKeyDown(ev) {
    const keyCode = ev.keyCode || ev.which;
    if (keyCode === 37) {
      this.prevSlide();
    } else if (keyCode === 39) {
      this.nextSlide();
    }
  }

  nextSlide() {
    this.navigate('next');
  }

  prevSlide() {
    this.navigate('prev');
  }

  navigate(dir = 'next') {
    const { shape, paths, slides, slideshow, animation, rect: { width } } = this.state;
    let { current } = this.state;

    if (this.isAnimating) return false;
    this.isAnimating = true;

    const animateShapeIn = anime({
      targets: shape,
      duration: animation.shape.duration,
      easing: animation.shape.easing.in,
      d: paths.final,
    });

    const animateSlides = () => {
      return new Promise((resolve, reject) => {
        const currentSlide = slides.children[current];
        const slidesTotal = slides.children.length;

        anime({
          targets: currentSlide,
          duration: animation.slides.duration,
          easing: animation.slides.easing,
          translateX: dir === 'next' ? -1 * width : width,
          complete: () => {
            currentSlide.classList.remove(s.current);
            resolve();
          },
        });

        current =
          dir === 'next'
            ? current < slidesTotal - 1 ? current + 1 : 0
            : current > 0 ? current - 1 : slidesTotal - 1;

        const newSlide = slides.children[current];
        newSlide.classList.add(s.current);

        anime({
          targets: newSlide,
          duration: animation.slides.duration,
          easing: animation.slides.easing,
          translateX: [dir === 'next' ? width : -1 * width, 0],
        });

        const newSlideImg = newSlide;
        anime.remove(newSlideImg);

        anime({
          targets: newSlideImg,
          duration: animation.slides.duration,
          easing: animation.slides.easing,
          translateX: [dir === 'next' ? 200 : -200, 0],
        });

        anime({
          targets: [newSlide.children[1], newSlide.children[2], newSlide.children[3]],
          duration: animation.slides.duration * 2,
          easing: animation.slides.easing,
          delay: (t, i) => i * 100 + 100,
          translateX: [dir === 'next' ? 300 : -300, 0],
          opacity: [0, 1],
        });
      });
    };

    const animateShapeOut = () => {
      anime({
        targets: shape,
        duration: animation.shape.duration,
        delay: 150,
        easing: animation.shape.easing.out,
        d: paths.initial,
        complete: () => {
          this.isAnimating = false;
          this.setState({ current });
        },
      });
    };

    animateShapeIn.finished.then(animateSlides).then(animateShapeOut);
  }

  renderSlides() {
    const { current } = this.state;
    const { slides } = this.props;

    return slides.map((slide, i) => {
      const { image, title, desc, link } = slide;

      return (
        <div key={i} className={classnames(s.slide, current === i ? s.current : '')}>
          <div className={s.img} style={{ backgroundImage: `url(${image})` }} />
          <h2 className={s.title}>{title}</h2>
          <p className={s.desc}>{desc}</p>
          <a className={s.link} href="#">
            {link}
          </a>
        </div>
      );
    });
  }

  render() {
    const { t } = this.props;

    return (
      <div className={s.slideshow} ref={r => (this.slideshow = r)}>
        <div className={s.slides} ref={r => (this.slides = r)}>
          {this.renderSlides()}
        </div>
        <nav className={s.slidenav} ref={r => (this.slidenav = r)}>
          <button className={classnames(s.item, s.prev)} onClick={() => this.prevSlide()}>
            {t.prev}
          </button>
          <span>/</span>
          <button className={classnames(s.item, s.next)} onClick={() => this.nextSlide()}>
            {t.next}
          </button>
        </nav>
      </div>
    );
  }
}

Slider.propTypes = {
  slides: PropTypes.array.isRequired,
  t: PropTypes.object.isRequired,
};

export default Slider;
