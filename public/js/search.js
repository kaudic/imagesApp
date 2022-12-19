const search = {
    init: async () => {
        console.log('script search initializing')
        search.addListennersToAction();
        // display pictures
        await search.getimagesDetails();
        search.drawImagesOnScreen();
        // load selects
        search.updateSelectFields();
    },
    properties: {
        images: [],
        filteredImages: [],
    },
    addListennersToAction: () => {
        // button '+' to tag a person on the image
        const plusBtn = document.querySelector('.iconFilterPlus');
        plusBtn.addEventListener('click', search.tagPersonOnScreen);

        // button to select all pictures
        const selectAllBtn = document.getElementById('selectAll');
        selectAllBtn.addEventListener('click', search.selectAllImages);

        // button to unselect all pictures
        const unSelectAllBtn = document.getElementById('unSelectAll');
        unSelectAllBtn.addEventListener('click', search.unSelectAllImages);

        // button to download elements
        const downloadAllBtn = document.getElementById('downloadAll');
        downloadAllBtn.addEventListener('click', search.downloadAllCheckedImages);

        // Btn to filter the images on screen
        const filterBtn = document.getElementById('filterBtn');
        filterBtn.addEventListener('click', search.filterAndDisplayPictures);

        // Btn to reset the input fields
        const deleteImageBtn = document.getElementById('deleteImageBtn');
        deleteImageBtn.addEventListener('click', search.resetSearchInfo);

        // Listenning to the scroll of the window
        window.addEventListener('scroll', search.drawImagesOnScrollEnd);
    },
    drawImagesOnScrollEnd: (e) => {
        // detect in the if clause if scroll reached end of browser
        if (window.innerHeight + window.pageYOffset >= 0.8 * (document.documentElement.scrollHeight)) {

            // identify the id of the last image in the screen
            const imagesContainer = document.getElementById('imagesContainer');
            const lastImgId = imagesContainer.lastElementChild.querySelector('img').id;
            const fullArrayOfImages = search.properties.filteredImages;

            // identify the index of the last image in the full array of images returned by the filter bar            const fullArrayOfImages = search.properties.filteredImages;
            const indexOfLastImg = fullArrayOfImages.findIndex((img) => {
                return img.id === parseInt(lastImgId);
            });

            // Draw the next 25 images
            for (let i = indexOfLastImg + 1; i < indexOfLastImg + 1 + 25; i++) {
                const thumbnail = document.querySelector('template').content;
                const image = thumbnail.querySelector('img');
                const checkBox = thumbnail.querySelector('input');
                checkBox.id = fullArrayOfImages[i].file_name;
                image.id = fullArrayOfImages[i].id;
                image.src = `imagesApp/assets/images/${fullArrayOfImages[i].file_name}`
                imagesContainer.appendChild(document.importNode(thumbnail, true));
            }
            // Add listenners to show up or hide details of the image
            const images = document.querySelectorAll('.resize');
            images.forEach((img) => {
                img.addEventListener('mouseenter', search.displayImgInfo);
                img.addEventListener('mouseleave', search.hideImgInfo);
                img.addEventListener('click', search.showImageInTagsView);
            });
        }
    },
    drawImagesOnScreen: () => {
        // get image container
        const imagesContainer = document.getElementById('imagesContainer');
        imagesContainer.innerHTML = '';
        const imagesToDisplay = search.properties.filteredImages;

        let loopMax = imagesToDisplay.length;
        if (loopMax > 50) {
            loopMax = 50;
        }

        // Draw the result after filtering
        for (let i = 0; i < loopMax; i++) {
            const thumbnail = document.querySelector('template').content;
            const image = thumbnail.querySelector('img');
            const checkBox = thumbnail.querySelector('input');
            checkBox.id = imagesToDisplay[i].file_name;
            image.id = imagesToDisplay[i].id;
            image.src = `imagesApp/assets/images/${imagesToDisplay[i].file_name}`
            imagesContainer.appendChild(document.importNode(thumbnail, true));
        }

        // Add listenners to show up or hide details of the image
        const images = document.querySelectorAll('.resize');
        images.forEach((img) => {
            img.addEventListener('mouseenter', search.displayImgInfo);
            img.addEventListener('mouseleave', search.hideImgInfo);
            img.addEventListener('click', search.showImageInTagsView);
        });
    },
    showImageInTagsView: async (e) => {
        e.preventDefault();
        window.location = `${BASE_URL}/tags/OneImageInTagView/${e.target.id}`;

    },
    resetSearchInfo: (e) => {
        e.preventDefault();
        // Get the input fields
        const inputs = document.querySelectorAll('input');
        inputs.forEach((input) => input.value = '');
        // Get the selects fields
        const selects = document.querySelectorAll('select');
        selects.forEach((select) => {
            console.log(select);
            select.value = 0;
        });
        // Reset the person container
        document.getElementById('personContainer').innerHTML = '';

    },
    filterAndDisplayPictures: async (e) => {
        e.preventDefault();
        await search.getimagesDetails();
        search.properties.filteredImages = search.properties.images;
        const images = search.properties.images;

        // Filter By Year
        const year = document.getElementById('imageYearInput').value;
        if (year) {
            const filterImages = images.filter((img) => img.year == year);
            search.properties.filteredImages = filterImages;
        }

        // Filter By Locality
        const localityId = document.getElementById('localityTag').value;
        if (localityId > 0 && year) {
            const filterImages = search.properties.filteredImages.filter((img) => img.locality_id == localityId);
            search.properties.filteredImages = filterImages;
        } else if (localityId > 0) {
            const filterImages = images.filter((img) => img.locality_id == localityId);
            search.properties.filteredImages = filterImages;
        }

        // Filter By Events
        const eventId = document.getElementById('eventTag').value;
        if (eventId > 0 && (year || localityId > 0)) {
            const filterImages = search.properties.filteredImages.filter((img) => img.event_id == eventId);
            search.properties.filteredImages = filterImages;
        } else if (eventId > 0) {
            const filterImages = images.filter((img) => img.event_id == eventId);
            search.properties.filteredImages = filterImages;
        }

        // Filter By persons
        const personsIds = [];
        const personsTaggued = document.querySelectorAll('.tagguedPerson');
        personsTaggued.forEach((person) => {
            personsIds.push(person.dataset.personId);
        });

        if (personsIds.length > 0 && (year || localityId > 0 || eventId > 0)) {
            const filterImages = search.properties.filteredImages.filter((img) => {
                let isImg = true;
                personsIds.forEach((id) => {
                    const test = img.person_name.filter((person) => {
                        return person.id == id
                    });
                    if (test.length === 0) IsImg = false;
                })
                return isImg;
            });
            search.properties.filteredImages = filterImages;
        } else if (personsIds.length > 0) {
            const filterImages = images.filter((img) => {
                let isImg = true;
                personsIds.forEach((id) => {
                    const test = img.person_name.filter((person) => {
                        return person.id == id
                    });
                    if (test.length === 0) {
                        isImg = false;
                    }
                })
                return isImg;
            });
            search.properties.filteredImages = filterImages;
        }

        // Draw Images on screen
        search.drawImagesOnScreen();

    },
    getimagesDetails: async () => {
        const imagesAndLinkedTables = await fetch(`${BASE_URL}/search/getAllImgAndLinkedTables`).then((res) => res.json());
        search.properties.images = imagesAndLinkedTables.data;
        search.properties.filteredImages = imagesAndLinkedTables.data;
    },

    displayImgInfo: (e) => {

        const imageId = e.target.id;
        const thumbnail = e.target.parentNode;

        // check if DIV already exist and if not create it, if yes just move it
        const isInfoDIv = thumbnail.querySelector('.infoDiv');
        // const imageInfo = search.properties.filteredImages.filter((img) => img.id == imageId);
        const imageInfo = search.properties.images.filter((img) => {
            return img.id == imageId
        });

        let yearText = '';
        if (imageInfo[0].year) {
            yearText = `Année: ${imageInfo[0].year}`;
        }

        let localityText = '';
        if (imageInfo[0].locality_name) {
            localityText = `\n Lieu: ${imageInfo[0].locality_name}`;
        }

        let eventText = '';
        if (imageInfo[0].event_name) {
            eventText = `\n Evènement: ${imageInfo[0].event_name}`;
        }

        let personNames = '';
        if (imageInfo[0].person_name[0].name) {
            personNames = `\n Personnes:`;

            imageInfo[0].person_name.forEach((person) => {
                personNames += ` ${person.name} -`;
            })
        }


        if (!isInfoDIv) {
            const infoDiv = document.createElement('div');
            infoDiv.classList.add('infoDiv');
            infoDiv.innerText = yearText + localityText + eventText + personNames;
            infoDiv.style.top = e.pageY + 'px';
            infoDiv.style.left = e.pageX + 'px';
            thumbnail.appendChild(infoDiv);
        }


        // alert(JSON.stringify(search.properties.images.filter((img) => img.id == imageId)));


    },
    hideImgInfo: (e) => {
        const thumbnail = e.target.parentNode;
        const infoDiv = thumbnail.querySelector('.infoDiv');
        thumbnail.removeChild(infoDiv);
    },
    updateSelectFields: async () => {
        // update person field
        const persons = await fetch(`${BASE_URL}/tags/getPersons`).then((res) => res.json());
        const personSelectTag = document.getElementById('personTag');
        personSelectTag.options.length = 1; // delete current options before adding all options
        persons.data.forEach((person) => {
            const option = document.createElement("option");
            option.value = person.id;
            option.text = person.name;
            personSelectTag.add(option);
        });
        // ... and select a 0 value by default
        personSelectTag.value = 0;

        // update locality field
        const localities = await fetch(`${BASE_URL}/tags/getAllLocalities`).then((res) => res.json());
        const localitySelectTag = document.getElementById('localityTag');
        localitySelectTag.options.length = 1; // delete current options before adding all options

        localities.data.forEach((locality) => {
            const option = document.createElement("option");
            option.value = locality.id;
            option.text = locality.name;
            localitySelectTag.add(option);

        });
        // ... and select a 0 value by default
        localitySelectTag.value = 0;

        // update events field
        const events = await fetch(`${BASE_URL}/tags/getAllEvents`).then((res) => res.json());
        const eventSelectTag = document.getElementById('eventTag');
        eventSelectTag.options.length = 1; // delete current options before adding all options

        events.data.forEach((event) => {
            const option = document.createElement("option");
            option.value = event.id;
            option.text = event.name;
            eventSelectTag.add(option);
        }); // ... and select a 0 value by default
        eventSelectTag.value = 0;
    },
    tagPersonOnScreen: () => {
        // create element personSpan in the personContainer
        const personContainer = document.getElementById('personContainer');
        const personTagSelectElt = document.getElementById('personTag');
        const personId = personTagSelectElt.value;

        if (personId === '0') return; // just checking that a person was selected

        const personName = personTagSelectElt.options[personTagSelectElt.selectedIndex].text;
        const personSpan = document.createElement('span');
        personSpan.textContent = personName;
        personSpan.classList.add('tagguedPerson');
        personSpan.dataset.personId = personId;
        const crossIcon = document.createElement('span');
        crossIcon.innerHTML = '<i class="fa-solid fa-circle-xmark crossIcon"></i>';
        personSpan.appendChild(crossIcon);
        personContainer.appendChild(personSpan);

        // add a script on the cross to enable remove of the newly taggued person
        search.addDeleteTagguedPersonToCrossBtns();

        // remove the person from the select element
        for (let i = 0; i < personTagSelectElt.length; i++) {
            if (personTagSelectElt.options[i].value === personId)
                personTagSelectElt.remove(i);
        };

    },
    addDeleteTagguedPersonToCrossBtns: () => {
        const personsCrossBtns = document.querySelectorAll('.crossIcon');
        personsCrossBtns.forEach((person) => person.addEventListener('click', search.deleteTagguedPerson));
    },
    deleteTagguedPerson: (e) => {
        e.preventDefault();
        // remove element from DOM personContainer
        const personSpan = e.target.parentNode.parentNode;
        personContainer.removeChild(personSpan);

        // create element back in the select
        const personId = personSpan.dataset.personId;
        const personName = personSpan.textContent;
        const personSelectTag = document.getElementById('personTag');
        const option = document.createElement("option");
        option.value = personId;
        option.text = personName;
        personSelectTag.add(option);

    },
    selectAllImages: (e) => {
        e.preventDefault();
        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
        checkboxes.forEach((checkBox) => checkBox.checked = true);
    },
    unSelectAllImages: (e) => {
        e.preventDefault();
        const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'));
        checkboxes.forEach((checkBox) => checkBox.checked = false);
    },
    downloadAllCheckedImages: async (e) => {
        const checkedElement = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));

        // loop on checked element and launch a download
        checkedElement.forEach(async (checkbox) => {
            const fileName = checkbox.id;

            const fileBlob = await fetch(`${BASE_URL}/images/downloadByFileName`, {
                method: 'POST',
                body: JSON.stringify({ fileName }),
                headers: {
                    'Content-Type': 'application/json'
                    // 'authorization': tag.properties.token
                }

            }).then(response => response.blob());

            console.log(fileBlob);

            //au retour du back, on lance le téléchargement
            const url = window.URL.createObjectURL(fileBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName.split('.')[0] + '.jpeg';
            a.click();
            a.remove();
        })

    }

};

document.addEventListener('DOMContentLoaded', search.init);