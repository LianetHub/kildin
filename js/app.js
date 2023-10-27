"use strict";


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
            Fancybox.bind("[data-fancybox]", {
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
                el.closest('.selectMultiple').classList.toggle('open');
            });
        });
        // document.querySelectorAll(".dropdown").forEach(function (dropdownWrapper) {
        //     const dropdownBtn = dropdownWrapper.querySelector(".dropdown__button");
        //     const dropdownList = dropdownWrapper.querySelector(".dropdown__list");
        //     const dropdownItems = dropdownList.querySelectorAll(".dropdown__list-item");
        //     // const dropdownInput = dropdownWrapper.querySelector(".dropdown__input");

        //     dropdownBtn.addEventListener("click", function () {
        //         dropdownList.classList.toggle("visible");
        //         this.classList.toggle("active");
        //     });

        //     dropdownItems.forEach(function (listItem) {
        //         listItem.addEventListener("click", function (e) {

        //             // if (e.target.querySelector('.dropdown__checkbox') || e.target.closest(".dropdown__checkbox")) {
        //             //     e.stopPropagation();
        //             //     return;
        //             // };

        //             dropdownItems.forEach(function (el) {
        //                 el.classList.remove("active");
        //             });
        //             e.target.classList.add("active");
        //             dropdownBtn.innerHTML = this.innerHTML;
        //             dropdownBtn.classList.add("selected");
        //             dropdownBtn.classList.remove("active");
        //             // dropdownInput.value = this.dataset.value;
        //             // dropdownList.classList.remove("visible");

        //             // let event = new Event('input');
        //             // document.dispatchEvent(event);
        //         });
        //     });



        //     document.addEventListener("keydown", function (e) {
        //         if (e.key === "Tab" || e.key === "Escape") {
        //             dropdownBtn.classList.remove("active");
        //             dropdownList.classList.remove("visible");
        //         }
        //     });
        // });

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

    });

    // document.addEventListener('input', (e) => {

    //     const target = e.target;

    //     if (target === document || target.closest('.maps__filters')) {
    //         sendFilterResponce();
    //     }

    // });

    // async function sendFilterResponce() {

    //     if (!document.querySelector('.maps__filters')) return;

    //     const URL = "https://monitoring.dev.ecofactor.pro/api/v1/requests/filter/";
    //     let formData = new FormData(document.querySelector('.maps__filters'));


    //     try {
    //         let response = await fetch(URL, {
    //             method: "POST",
    //             body: formData
    //         });

    //         if (response.ok) {
    //             // ВАШ КОД ОБНОВЛЕНИЯ КАРТЫ
    //             console.log(response);
    //         }

    //     } catch (err) {
    //         console.log(err)
    //     }
    // }


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

