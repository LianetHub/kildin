"use strict";



const RESPONSE_URL = "https://monitoring.dev.ecofactor.pro/api/v1/requests/filter/";
// const RESPONSE_URL = "./json/test.json";
const ICON_IMAGE_HREF = "/img/icons/location.svg";


document.addEventListener("DOMContentLoaded", () => {




    barba.init({
        preventRunning: true,
        prefetchIgnore: true,
        // debug: true,
        transitions: [{
            name: 'base',

            async leave(data) {
                if (window.innerWidth < 767) {
                    barba.go(data.trigger.href)
                }
                await pageAnimIn(data);
                data.current.container.remove();
            },

            async enter(data) {
                await pageAnimOut(data.next.container);

            },

            async afterEnter() {
                var vids = document.querySelectorAll("video");
                vids.forEach(vid => { var playPromise = vid.play(); if (playPromise !== undefined) { playPromise.then(_ => { }).catch(error => { }); }; });

                initUI();

            }
        }]
    });

    calcWrapperOffsets();
    initUI();




    // Barba Animate functions

    function pageAnimIn(data) {

        let trigger = data.trigger.closest('.navigation__item');
        if (!trigger) {
            trigger = document.querySelector('.navigation__item');
        }
        document.querySelector('.navigation').classList.add('pending');
        return gsap.to(trigger, { width: "100%", duration: 0.5, ease: "power2.in" }).then(() => {
            activeNavItem(data.trigger.closest('.navigation__item'));
        })

    }

    function pageAnimOut() {

        let trigger = document.querySelector('.navigation__item.active');
        if (!trigger) {
            trigger = document.querySelector('.navigation__item');
        }
        return gsap.to(trigger, { width: "auto", duration: 0.5, ease: "power2.out" }).then(() => {
            document.querySelector('.navigation').classList.remove('pending');
        })

    }

    function activeNavItem(trigger) {
        const navItems = document.querySelectorAll('.navigation__item');
        navItems.forEach(navItem => {
            navItem.classList.remove('active');
        });
        if (trigger) {
            trigger.classList.add('active');
        }
        calcWrapperOffsets();
    }

    function calcWrapperOffsets() {

        const navItems = document.querySelectorAll('.navigation__item');
        const navItemWidth = document.querySelector('.navigation__item:not(.active):not(:first-child)').getBoundingClientRect().width;

        let rightOffset = navItems.length * navItemWidth;
        let leftOffset = 0;

        navItems.forEach((navItem, index) => {

            let realIndex = index + 1;

            if (navItem.classList.contains('active')) {
                rightOffset = (navItems.length - realIndex) * navItemWidth;
                leftOffset = realIndex * navItemWidth;
            }
        })

        document.body.style.setProperty('--padding-wrapper-right', `${rightOffset}px`);
        document.body.style.setProperty('--padding-wrapper-left', `${leftOffset}px`);


    }


    // App functions

    function initUI() {

        sendFilterResponce();

        initSpollers();
        initDropdows();
        initSliders();
        initFancyBox();
    }

    function initFancyBox() {
        if (typeof Fancybox !== "undefined" && Fancybox !== null) {
            Fancybox.bind("[data-fancybox]");
            Fancybox.defaults.closeButton = false;
            Fancybox.defaults.dragToClose = false;
        }
    }

    function initSliders() {
        if (document.querySelectorAll('.popup__slider')) {
            document.querySelectorAll('.popup__slider').forEach(slider => {

                let next = slider.querySelector('.popup__next');
                let prev = slider.querySelector('.popup__prev');

                new Swiper(slider, {
                    speed: 800,
                    slidesPerView: 1,
                    navigation: {
                        nextEl: next,
                        prevEl: prev
                    }
                })
            })
        }

        if (document.querySelectorAll('.article__slider')) {
            document.querySelectorAll('.article__slider').forEach(articleSlider => {

                let prev = articleSlider.querySelector('.article__slider-prev');
                let next = articleSlider.querySelector('.article__slider-next');

                new Swiper(articleSlider, {
                    slidesPerView: 1,
                    navigation: {
                        nextEl: next,
                        prevEl: prev
                    }
                })
            })
        }
    }

    function initDropdows() {
        // CUSTOM DROPDOWN

        var selects = document.querySelectorAll('select[multiple]');

        selects.forEach(select => {

            var selectOptions = select.querySelectorAll('option');

            var newSelect = document.createElement('div');
            newSelect.classList.add('selectMultiple');
            var active = document.createElement('div');
            active.classList.add('active');
            var optionList = document.createElement('ul');
            var placeholder = select.dataset.placeholder;

            var span = document.createElement('span');
            span.innerText = placeholder;
            active.appendChild(span);

            selectOptions.forEach((option) => {
                let text = option.innerText;
                if (option.selected) {
                    let tag = document.createElement('a');
                    tag.dataset.value = option.value;
                    tag.innerHTML = "<em>" + text + "</em><i></i>";
                    active.appendChild(tag);
                    span.classList.add('hide');
                } else {
                    let item = document.createElement('li');
                    item.dataset.value = option.value;
                    item.innerHTML = text;
                    optionList.appendChild(item);
                }
            });
            var arrow = document.createElement('div');
            arrow.classList.add('arrow');
            active.appendChild(arrow);

            newSelect.appendChild(active);
            newSelect.appendChild(optionList);

            select.parentElement.append(newSelect);
            span.appendChild(select);
        });

        document.querySelectorAll('.selectMultiple ul').forEach(el => {

            el.addEventListener('click', (e) => {
                let li = e.target.closest('li');
                if (!li) { return; }

                let select = li.closest('.selectMultiple');
                if (!select.classList.contains('clicked')) {
                    select.classList.add('clicked');
                    if (li.previousElementSibling) {
                        li.previousElementSibling.classList.add('beforeRemove');
                    }
                    if (li.nextElementSibling) {
                        li.nextElementSibling.classList.add('afterRemove');
                    }
                    li.classList.add('remove');
                    let a = document.createElement('a');
                    a.dataset.value = li.dataset.value;
                    a.innerHTML = "<em>" + li.innerText + "</em><i></i>";
                    a.classList.add('notShown');
                    // a.style.display = "none";
                    select.querySelector('div').appendChild(a); //might have to check later
                    let selectEl = select.querySelector('select');
                    let opt = selectEl.querySelector('option[value="' + li.dataset.value + '"]');
                    opt.setAttribute('selected', 'selected');
                    setTimeout(() => {
                        a.classList.add('shown');
                        select.querySelector('span').classList.add('hide');

                    }, 300);
                    //1st
                    setTimeout(() => {
                        let styles = window.getComputedStyle(li);
                        let liHeight = styles.height;
                        let liPadding = styles.padding;
                        let removing = li.animate([
                            {
                                height: liHeight,
                                padding: liPadding
                            },
                            {
                                height: '0px',
                                padding: '0px'
                            }
                        ], {
                            duration: 300, easing: 'ease-in-out'
                        });
                        removing.onfinish = () => {
                            if (li.previousElementSibling) {
                                li.previousElementSibling.classList.remove('beforeRemove');
                            }
                            if (li.nextElementSibling) {
                                li.nextElementSibling.classList.remove('afterRemove');
                            }
                            li.remove();
                            select.classList.remove('clicked');
                        }

                    }, 300); //600
                    //2nd
                }
            });
        })

        document.querySelectorAll('.selectMultiple > div').forEach(el => {
            el.addEventListener('click', (e) => {

                let a = e.target.closest('a');
                let select = e.target.closest('.selectMultiple');
                if (!a) { return; }

                a.className = '';
                a.classList.add('remove');
                console.log('work 2');

                select.classList.add('open');
                let selectEl = select.querySelector('select');
                let opt = selectEl.querySelector('option[value="' + a.dataset.value + '"]');
                opt.removeAttribute('selected');

                a.classList.add('disappear');
                setTimeout(() => {
                    // start animation
                    let styles = window.getComputedStyle(a);
                    let padding = styles.padding;
                    let deltaWidth = styles.width;
                    let deltaHeight = styles.height;

                    let removeOption = a.animate([
                        {
                            width: deltaWidth,
                            height: deltaHeight,
                            padding: padding
                        },
                        {
                            width: '0px',
                            height: '0px',
                            padding: '0px'
                        }
                    ], {
                        duration: 0,
                        easing: 'ease-in-out'
                    });

                    let li = document.createElement('li');
                    li.dataset.value = a.dataset.value;
                    li.innerText = a.querySelector('em').innerText;
                    li.classList.add('show');
                    select.querySelector('ul').appendChild(li);
                    setTimeout(() => {
                        if (!selectEl.selectedOptions.length) {
                            select.querySelector('span').classList.remove('hide');
                        }
                        li.className = '';
                    }, 350);

                    removeOption.onfinish = () => {
                        a.remove();
                    }
                    //end animation

                }, 300);
                //}, 400);
            });
        })


        document.querySelectorAll('.selectMultiple > div .arrow, .selectMultiple > div span').forEach((el) => {
            el.addEventListener('click', (e) => {
                document.querySelectorAll('.selectMultiple.open').forEach(select => {
                    if (select !== e.target.closest('.selectMultiple')) {
                        select.classList.remove('open');
                    }
                });
                el.closest('.selectMultiple').classList.toggle('open');
            });
        });

    }

    function initSpollers() {

        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {

            const spollersRegular = Array.from(spollersArray).filter(function (
                item,
                index,
                self
            ) {
                return !item.dataset.spollers.split(",")[0];
            });

            if (spollersRegular.length > 0) {
                initSpollers(spollersRegular);
            }

            const spollersMedia = Array.from(spollersArray).filter(function (
                item,
                index,
                self
            ) {
                return item.dataset.spollers.split(",")[0];
            });

            if (spollersMedia.length > 0) {
                const breakpointsArray = [];
                spollersMedia.forEach((item) => {
                    const params = item.dataset.spollers;
                    const breakpoint = {};
                    const paramsArray = params.split(",");
                    breakpoint.value = paramsArray[0];
                    breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                    breakpoint.item = item;
                    breakpointsArray.push(breakpoint);
                });


                let mediaQueries = breakpointsArray.map(function (item) {
                    return (
                        "(" +
                        item.type +
                        "-width: " +
                        item.value +
                        "px)," +
                        item.value +
                        "," +
                        item.type
                    );
                });
                mediaQueries = mediaQueries.filter(function (item, index, self) {
                    return self.indexOf(item) === index;
                });


                mediaQueries.forEach((breakpoint) => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);

                    const spollersArray = breakpointsArray.filter(function (item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) {
                            return true;
                        }
                    });

                    matchMedia.addListener(function () {
                        initSpollers(spollersArray, matchMedia);
                    });
                    initSpollers(spollersArray, matchMedia);
                });
            }


            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock) => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_init");
                        initSpollerBody(spollersBlock);
                        spollersBlock.addEventListener("click", setSpollerAction);
                    } else {
                        spollersBlock.classList.remove("_init");
                        initSpollerBody(spollersBlock, false);
                        spollersBlock.removeEventListener("click", setSpollerAction);
                    }
                });
            }

            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                const spollerTitles = spollersBlock.querySelectorAll("[data-spoller]");
                if (spollerTitles.length > 0) {
                    spollerTitles.forEach((spollerTitle) => {
                        if (hideSpollerBody) {
                            spollerTitle.removeAttribute("tabindex");
                            if (!spollerTitle.classList.contains("_active")) {
                                spollerTitle.nextElementSibling.hidden = true;
                            }
                        } else {
                            spollerTitle.setAttribute("tabindex", "-1");
                            spollerTitle.nextElementSibling.hidden = false;
                        }
                    });
                }
            }

            function setSpollerAction(e) {
                const el = e.target;
                if (el.hasAttribute("data-spoller") || el.closest("[data-spoller]")) {
                    const spollerTitle = el.hasAttribute("data-spoller")
                        ? el
                        : el.closest("[data-spoller]");
                    const spollersBlock = spollerTitle.closest("[data-spollers]");
                    const oneSpoller = spollersBlock.hasAttribute("data-one-spoller")
                        ? true
                        : false;
                    if (!spollersBlock.querySelectorAll("._slide").length) {
                        if (oneSpoller && !spollerTitle.classList.contains("_active")) {
                            hideSpollersBody(spollersBlock);
                        }
                        spollerTitle.classList.toggle("_active");
                        spollerTitle.nextElementSibling.slideToggle(300);
                    }
                    e.preventDefault();
                }
            }

            function hideSpollersBody(spollersBlock) {
                const spollerActiveTitle = spollersBlock.querySelector(
                    "[data-spoller]._active"
                );
                if (spollerActiveTitle) {
                    spollerActiveTitle.classList.remove("_active");
                    spollerActiveTitle.nextElementSibling.slideUp(300);
                }
            }
        }

    }

    // Event handlers


    window.addEventListener('resize', () => {
        calcWrapperOffsets();


    });

    document.addEventListener('click', (e) => {

        const target = e.target;

        if (target.closest('.icon-menu')) {
            document.querySelector('.navigation').classList.toggle('open');
            toggleLocking();
            document.querySelector('.icon-menu').classList.toggle('active');
        }

        if (target.classList.contains('maps__btn')) {
            e.preventDefault();
            sendFilterResponce();
        }

    });




    function initMap() {

        if (!document.querySelector("#map")) return;

        document.querySelector("#map").innerHTML = "";

        var myMap = new ymaps.Map("map", {
            center: [69.34898894941716, 34.18545550000002],
            zoom: 12,
            controls: []
        });



        if (document.querySelectorAll('.maps__placemark')) {
            document.querySelectorAll('.maps__placemark').forEach(placeMark => {

                let coords = placeMark.dataset.coords.split(',');
                let modalId = placeMark.dataset.modal;


                var mark = new ymaps.Placemark(coords, {}, {
                    iconLayout: 'default#image',
                    iconImageHref: ICON_IMAGE_HREF,
                    modalId: modalId
                });


                myMap.geoObjects.add(mark);

            });

            myMap.geoObjects.events.add('click', function (e) {
                // Объект на котором произошло событие
                var target = e.get('target');
                var modalId = target.options._options.modalId;

                Fancybox.show([{
                    src: modalId
                }])
            });

        }




    }


    async function sendFilterResponce() {

        if (!document.querySelector('.maps__filters')) {
            ymaps.ready(initMap);
            return;
        };

        let formData = new FormData(document.querySelector('.maps__filters'));




        let objectJson = {};
        formData.forEach(function (value, key) {

            if (objectJson.hasOwnProperty(key)) {
                objectJson[key].push(value);
            } else {
                objectJson[key] = value;
                if (key !== 'object') {
                    objectJson[key] = Array.from(objectJson[key]);
                }
            }
        });

        let json = JSON.stringify(objectJson);
        console.log(json);


        try {
            let response = await fetch(RESPONSE_URL, {
                method: "POST",
                body: json
            });

            // let response = await fetch(RESPONSE_URL);

            if (response.ok) {

                let result = await response.json();

                renderContent(result);
                ymaps.ready(initMap);
            }

        } catch (err) {
            console.log(err)
        }
    }


    function renderContent(json) {
        let placemarks = document.querySelector('.maps__placemarks');
        let modals = document.querySelector('.maps__modals');

        placemarks.innerHTML = "";
        modals.innerHTML = "";

        let { requests } = json;
        requests.forEach(request => {
            let { id, coordinates, req_popup } = request;

            modals.innerHTML += req_popup;

            let placemark = document.createElement('div');
            placemark.classList.add('maps__placemark');
            placemark.setAttribute('data-coords', coordinates);
            placemark.setAttribute('data-modal', `#modal-${id}`);

            placemarks.appendChild(placemark);


        })

    }

    // lock body 

    function toggleLocking(lockClass) {

        const body = document.body;
        let className = lockClass ? lockClass : "lock";
        let pagePosition;

        if (body.classList.contains(className)) {
            pagePosition = parseInt(document.body.dataset.position, 10);
            body.dataset.position = pagePosition;
            body.style.top = -pagePosition + 'px';
        } else {
            pagePosition = window.scrollY;
            body.style.top = 'auto';
            window.scroll({ top: pagePosition, left: 0 });
            document.body.removeAttribute('data-position');
        }

        let lockPaddingValue = body.classList.contains(className)
            ? "0px"
            : window.innerWidth -
            document.querySelector(".wrapper").offsetWidth +
            "px";

        body.style.paddingRight = lockPaddingValue;
        body.classList.toggle(className);

    }


});

HTMLElement.prototype.slideToggle = function (duration, callback) {
    if (this.clientHeight === 0) {
        _s(this, duration, callback, true);
    } else {
        _s(this, duration, callback);
    }
};

HTMLElement.prototype.slideUp = function (duration, callback) {
    _s(this, duration, callback);
};

HTMLElement.prototype.slideDown = function (duration, callback) {
    _s(this, duration, callback, true);
};

function _s(el, duration, callback, isDown) {

    if (typeof duration === 'undefined') duration = 400;
    if (typeof isDown === 'undefined') isDown = false;

    el.style.overflow = "hidden";
    if (isDown) el.style.display = "block";

    var elStyles = window.getComputedStyle(el);

    var elHeight = parseFloat(elStyles.getPropertyValue('height'));
    var elPaddingTop = parseFloat(elStyles.getPropertyValue('padding-top'));
    var elPaddingBottom = parseFloat(elStyles.getPropertyValue('padding-bottom'));
    var elMarginTop = parseFloat(elStyles.getPropertyValue('margin-top'));
    var elMarginBottom = parseFloat(elStyles.getPropertyValue('margin-bottom'));

    var stepHeight = elHeight / duration;
    var stepPaddingTop = elPaddingTop / duration;
    var stepPaddingBottom = elPaddingBottom / duration;
    var stepMarginTop = elMarginTop / duration;
    var stepMarginBottom = elMarginBottom / duration;

    var start;

    function step(timestamp) {

        if (start === undefined) start = timestamp;

        var elapsed = timestamp - start;

        if (isDown) {
            el.style.height = (stepHeight * elapsed) + "px";
            el.style.paddingTop = (stepPaddingTop * elapsed) + "px";
            el.style.paddingBottom = (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop = (stepMarginTop * elapsed) + "px";
            el.style.marginBottom = (stepMarginBottom * elapsed) + "px";
        } else {
            el.style.height = elHeight - (stepHeight * elapsed) + "px";
            el.style.paddingTop = elPaddingTop - (stepPaddingTop * elapsed) + "px";
            el.style.paddingBottom = elPaddingBottom - (stepPaddingBottom * elapsed) + "px";
            el.style.marginTop = elMarginTop - (stepMarginTop * elapsed) + "px";
            el.style.marginBottom = elMarginBottom - (stepMarginBottom * elapsed) + "px";
        }

        if (elapsed >= duration) {
            el.style.height = "";
            el.style.paddingTop = "";
            el.style.paddingBottom = "";
            el.style.marginTop = "";
            el.style.marginBottom = "";
            el.style.overflow = "";
            if (!isDown) el.style.display = "none";
            if (typeof callback === 'function') callback();
        } else {
            window.requestAnimationFrame(step);
        }
    }

    window.requestAnimationFrame(step);
}

