"use strict";


document.addEventListener("DOMContentLoaded", () => {



    const initProps = {
        preventRunning: true,
        prefetchIgnore: true,
        // debug: true,
        transitions: [{
            name: 'base',

            async leave(data) {
                await pageAnimIn(data);
                data.current.container.remove();
            },

            async enter(data) {
                await pageAnimOut(data.next.container);

            },

            async afterEnter() {
                var vids = document.querySelectorAll("video");
                vids.forEach(vid => { var playPromise = vid.play(); if (playPromise !== undefined) { playPromise.then(_ => { }).catch(error => { }); }; });

                initUI()

            }
        }]
    }

    initBarba();
    calcWrapperOffsets();
    initUI();

    function initBarba() {
        if (window.innerWidth < 768) {
            barba.destroy();
        } else {
            barba.init(initProps);
        }
    }


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
        initMap();
        initSliders();
        initFancyBox();
        initDropdows();
    }

    function initMap() {
        if (document.querySelector('#map')) {
            let map = L.map('map', {
                center: [51.505, -0.09],
                zoom: 13
            });
        }
    }

    function initFancyBox() {
        if (typeof Fancybox !== "undefined" && Fancybox !== null) {
            Fancybox.bind(".leaflet-marker-icon", {
                dragToClose: false,
                closeButton: false
            });
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
    }

    function initDropdows() {
        // CUSTOM DROPDOWN

        document.querySelectorAll(".dropdown").forEach(function (dropdownWrapper) {
            const dropdownBtn = dropdownWrapper.querySelector(".dropdown__button");
            const dropdownList = dropdownWrapper.querySelector(".dropdown__list");
            const dropdownItems = dropdownList.querySelectorAll(".dropdown__list-item");
            const dropdownInput = dropdownWrapper.querySelector(".dropdown__input");

            dropdownBtn.addEventListener("click", function () {
                dropdownList.classList.toggle("visible");
                this.classList.toggle("active");
            });

            dropdownItems.forEach(function (listItem) {
                listItem.addEventListener("click", function (e) {




                    if (e.target.querySelector('.dropdown__checkbox') || e.target.closest(".dropdown__checkbox")) {
                        e.stopPropagation();
                        return;
                    };

                    dropdownItems.forEach(function (el) {
                        el.classList.remove("active");
                    });
                    e.target.classList.add("active");
                    dropdownBtn.innerHTML = this.innerHTML;
                    dropdownBtn.classList.add("selected");
                    dropdownBtn.classList.remove("active");
                    dropdownInput.value = this.dataset.value;
                    dropdownList.classList.remove("visible");
                });
            });



            document.addEventListener("keydown", function (e) {
                if (e.key === "Tab" || e.key === "Escape") {
                    dropdownBtn.classList.remove("active");
                    dropdownList.classList.remove("visible");
                }
            });
        });

    }


    // Event handlers

    window.addEventListener('resize', () => {
        calcWrapperOffsets();
        initBarba();
    });

    document.addEventListener('click', (e) => {

        const target = e.target;

        if (target.closest('.icon-menu')) {
            document.querySelector('.navigation').classList.toggle('open');
            devFuctions.toggleLocking();
            document.querySelector('.icon-menu').classList.toggle('active');
        }

    });






});

