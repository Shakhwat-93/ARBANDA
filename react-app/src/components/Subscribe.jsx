import React from 'react';

export default function Subscribe() {
    return (
        <div className="section">
            <div className="container">
                <div className="subscribe-form-wrapper">
                    <div className="subscribe-form-block">
                        <div className="main-text">Get 10% off on your first purchase</div>
                        <p className="subscribe-form-paragraph">Pamper your skin with the purest organic ingredients and experience the difference of natural skincare.</p>
                        <div data-w-id="94ad1a15-a764-a1ee-f194-0bd3f8dcd9ce" className="subscribe-form-holder w-form">
                            <form id="Subscribe-Form" name="wf-form-Subscribe-Form" data-name="Subscribe Form" method="get" className="subscribe-form" data-wf-page-id="64c90de928c2823d70ea1bd4" data-wf-element-id="94ad1a15-a764-a1ee-f194-0bd3f8dcd9cf">
                                <input className="subscribe-email w-input" maxLength="256" name="Email" data-name="Email" placeholder="your e-mail" type="email" id="Email" required="" />
                                <input type="submit" data-wait="..." className="subscribe-button w-button" value="Subscribe" />
                            </form>
                            <div className="success-message w-form-done">
                                <div>Thank you! We got you!</div>
                            </div>
                            <div className="error-message w-form-fail">
                                <div>Oops! Something went wrong. Try again!</div>
                            </div>
                        </div>
                    </div>
                    <div className="subscribe-form-image-holder">
                        <img src="/images/64cbb7dc64addf492b8e7379_Shop%20Item%20Image.webp" loading="lazy" sizes="(max-width: 479px) 92vw, (max-width: 767px) 95vw, (max-width: 991px) 93vw, (max-width: 1279px) 40vw, (max-width: 1439px) 470.578125px, 547.71875px" srcSet="/images/64cbb7dc64addf492b8e7379_Shop%20Item%20Image-p-500.webp 500w, /images/64cbb7dc64addf492b8e7379_Shop%20Item%20Image-p-800.webp 800w, /images/64cbb7dc64addf492b8e7379_Shop%20Item%20Image-p-1080.webp 1080w, /images/64cbb7dc64addf492b8e7379_Shop%20Item%20Image_1.webp 1431w" alt="" className="subscribe-form-image" />
                    </div>
                </div>
            </div>
        </div>
    );
}
