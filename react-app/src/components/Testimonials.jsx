import React from 'react';

export default function Testimonials() {
    return (
        <div className="section overflow-hidden">
            <div className="container">
                <div className="slider-title-holder">
                    <div className="main-text">People talk about us</div>
                </div>
                <div data-delay="4000" data-animation="slide" className="slider w-slider" data-autoplay="false" data-easing="ease" data-hide-arrows="false" data-disable-swipe="false" data-autoplay-limit="0" data-nav-spacing="3" data-duration="500" data-infinite="true">
                    <div className="mask w-slider-mask">
                        <div className="slide w-slide">
                            <div className="slide-content-holder">
                                <div className="slide-image-holder">
                                    <img src="/images/64cba53ee035517f8ade12b4_Slide%20Image.jpg" loading="lazy" alt="" className="_100pct-image" />
                                </div>
                                <div className="slide-content-wrapper">
                                    <div className="author">Jacqueline Asong</div>
                                    <div className="authors-quote">Especially in web design, paper prototypes can be used to probe the illegibility of a design: A high-fidelity design mockup</div>
                                </div>
                            </div>
                        </div>
                        <div className="slide w-slide">
                            <div className="slide-content-holder">
                                <div className="slide-image-holder">
                                    <img src="/images/64cba53e4176860782872e83_Slide%20Image%202.jpg" loading="lazy" alt="" className="_100pct-image" />
                                </div>
                                <div className="slide-content-wrapper">
                                    <div className="author">Loni Bowcher</div>
                                    <div className="authors-quote">Especially in web design, paper prototypes can be used to probe the illegibility of a design: A high-fidelity design mockup</div>
                                </div>
                            </div>
                        </div>
                        <div className="slide w-slide">
                            <div className="slide-content-holder">
                                <div className="slide-image-holder">
                                    <img src="/images/64cba53ee035517f8ade12b4_Slide%20Image.jpg" loading="lazy" alt="" className="_100pct-image" />
                                </div>
                                <div className="slide-content-wrapper">
                                    <div className="author">Jacqueline Asong</div>
                                    <div className="authors-quote">Especially in web design, paper prototypes can be used to probe the illegibility of a design: A high-fidelity design mockup</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="left-arrow w-slider-arrow-left">
                        <div className="w-icon-slider-left"></div>
                    </div>
                    <div className="right-arrow w-slider-arrow-right">
                        <div className="w-icon-slider-right"></div>
                    </div>
                    <div className="slide-nav invert w-slider-nav w-round"></div>
                </div>
            </div>
            <div className="infinit-text-parent">
                <div className="infinit-text-wrapper">
                    <div className="infinit-text-holder">
                        <div className="infinit-text _1">ARBANDA</div>
                        <div className="infinit-text _2">ARBANDA</div>
                        <div className="infinit-text _3">ARBANDA</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
