const tag = {
    init: async () => {
        console.log('tag script initialisation...');
        tag.addEventsToAction();

        // Fill in the options in the select fields with data from Database
        tag.updateSelectFields();

        // Init the socket for the tag page
        const socket = tag.initSocket();

        // in case of a problem with the socket then we will receive an event from the server
        socket.on('askForNewSocket', (message) => {
            console.log(message);
            tag.initSocket();
        });

        socket.on('error', (message) => {
            console.log(message);
            tag.initSocket();
        });


        // check Tag mode dataset in title
        const title = document.querySelector('.project_h2Title');

        if (title.dataset.type === 'multiTagMode') {
            // get all images details and set them up in attributes names properties.images
            await tag.getAllImagesAndLinkedTablesNotTaggued();
            // display first image
            tag.displayImageInfo(0);

        };
        if (title.dataset.type === 'singleTagMode') {
            // get Image id from title dataset
            const imageId = title.dataset.id;
            // Get image Info
            await tag.getOneImageAndLinkedTables(imageId);
            // Display Image Info
            tag.displayImageInfo(0);

            // hide the arrows
            document.getElementById('imgRight').classList.add('hidden');
            document.getElementById('imgLeft').classList.add('hidden');

            // Delete title text and
            // display a go back button that will return to previous page
            title.textContent = '';
            const tagContainerElt = document.querySelector('.tagContainer');
            const goBackBtn = document.createElement('button');
            goBackBtn.textContent = 'Retour';
            goBackBtn.addEventListener('click', () => history.back());
            goBackBtn.classList.add('button_taguer');
            tagContainerElt.prepend(goBackBtn);

        };
    },
    initSocket: () => {
        // Register socket in tag properties
        let ioServerPath = BASE_URL;
        let socket;
        ioServerPath = BASE_URL.replace('/imagesApp', '');

        if (ioServerPath.includes('audicserver')) {
            socket = io(ioServerPath, { path: '/imagesApp/socket.io/' });
        } else {
            socket = io(ioServerPath);
        }

        socket.on('welcome', (socketId) => {
            console.log('socketId: ' + socketId);
            tag.properties.socket = socketId
        });

        return socket;
    },
    properties: {
        imageDisplayedIndex: 0,
        images: [],
        socket: ''
    },
    addEventsToAction: () => {
        // Identify Elements
        const personCreationBtn = document.getElementById('personCreationBtn');
        personCreationBtn.addEventListener('click', tag.createPerson);
        const personDeleteBtn = document.getElementById('personDeleteBtn');
        personDeleteBtn.addEventListener('click', tag.deletePerson);
        const personModificationBtn = document.getElementById('personModificationBtn');
        personModificationBtn.addEventListener('click', tag.modifyPerson);

        const localityCreationBtn = document.getElementById('localityCreationBtn');
        localityCreationBtn.addEventListener('click', tag.createLocality);
        const localityDeleteBtn = document.getElementById('localityDeleteBtn');
        localityDeleteBtn.addEventListener('click', tag.deleteLocality);
        const localityModificationBtn = document.getElementById('localityModificationBtn');
        localityModificationBtn.addEventListener('click', tag.modifyLocality);

        const eventCreationBtn = document.getElementById('eventCreationBtn');
        eventCreationBtn.addEventListener('click', tag.createEvent);
        const eventDeleteBtn = document.getElementById('eventDeleteBtn');
        eventDeleteBtn.addEventListener('click', tag.deleteEvent);
        const eventModificationBtn = document.getElementById('eventModificationBtn');
        eventModificationBtn.addEventListener('click', tag.modifyEvent);

        // button to go to left Image
        const leftBtn = document.getElementById('imgLeft');
        leftBtn.addEventListener('click', (e) => {
            e.preventDefault();
            tag.displayImageInfo(-1)
        });

        // button to go to Right Image
        const rightBtn = document.getElementById('imgRight');
        rightBtn.addEventListener('click', (e) => {
            e.preventDefault();
            tag.displayImageInfo(1);

        });

        // button '+' to tag a person on the image
        const plusBtn = document.querySelector('.iconFilterPlus');
        plusBtn.addEventListener('click', tag.tagPersonOnScreen);

        // button to delete image on server and on Database
        const deleteImageBtn = document.getElementById('deleteImageBtn');
        deleteImageBtn.addEventListener('click', tag.deleteImage);

        // button to download image
        const downloadBtn = document.getElementById('downloadBtn');
        downloadBtn.addEventListener('click', tag.downloadImageByName);

        // button to rotate the image on the right
        const rotateRightBtn = document.getElementById('rotateRight');
        rotateRightBtn.addEventListener('click', tag.rotateRight);

        // Btn to tag the image with all the different information
        const tagBtn = document.getElementById('tagBtn');
        tagBtn.addEventListener('click', tag.tagImage);

    },
    goToPreviousPage: () => {
        history.back();
    },
    rotateRight: (e) => {
        e.preventDefault();
        const image = document.getElementById('imageContainer');
        if (tag.properties.rotationDegree) {
            tag.properties.rotationDegree += 90;
        } else {
            tag.properties.rotationDegree = 90;
        }
        image.style.transform = `rotate(${tag.properties.rotationDegree}deg)`;

    },
    getAndSaveToken: () => {
        // get the token and if any
        const token = window.localStorage.getItem('audicServerToken');
        // save the token in the tag properties
        if (token) {
            tag.properties.token = token;
        }
    },
    downloadImageByName: async (e) => {
        e.preventDefault();

        // get fileName
        const fileName = document.getElementById('fileNameInput').value;

        const fileBlob = await fetch(`${BASE_URL}/images/downloadByFileName`, {
            method: 'POST',
            body: JSON.stringify({ fileName }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            }

        }).then(response => response.blob());

        //au retour du back, on lance le téléchargement
        const url = window.URL.createObjectURL(fileBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        a.remove();

    },
    deleteImage: async (e) => {
        e.preventDefault();
        // get imageId and file name
        const imageId = document.getElementById('imageContainer').dataset.imgId;
        const fileName = document.getElementById('fileNameInput').value;

        // fetch on a delete route
        const deletedImage = await fetch(`${BASE_URL}/images/delete`, {
            method: 'DELETE',
            body: JSON.stringify({
                imageId, fileName
            }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            }
        }).then(res => res.json());

        // Delete in Tag socket table
        await fetch(`${BASE_URL}/images/deleteBeingTagged`, {
            method: 'POST',
            body: JSON.stringify({
                imageId,
                socket: tag.properties.socket
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // delete from the cache variable
        tag.properties.images.splice(tag.properties.imageDisplayedIndex, 1);

        // display next image
        // if multi tag mode then go to next image
        if (document.querySelector('.project_h2Title').dataset.type === 'multiTagMode') {
            tag.displayImageInfo(0);
        } else {// if not then go to previous page
            tag.goToPreviousPage();
        }

    },
    tagImage: async () => {
        // Get the different information from inputs
        const imageId = document.getElementById('imageContainer').dataset.imgId;
        const year = document.getElementById('imageYearInput').value;
        if (isNaN(Number(year)) || year.length !== 4 || Number(year) > new Date().getFullYear()) {
            return Swal.fire({
                title: 'Erreur de saisie',
                text: `L'année doit être un nombre à 4 chiffres, inférieur ou égal à l'année en cours`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
        const localityId = document.getElementById('localityTag').value;
        const eventId = document.getElementById('eventTag').value;
        const personsIds = [];
        const personsTaggued = document.querySelectorAll('.tagguedPerson');
        personsTaggued.forEach((person) => {
            personsIds.push(person.dataset.personId);
        });

        // Fetch with PATCH method
        const updatedImage = await fetch(`${BASE_URL}/images/updateTags`, {
            method: 'PATCH',
            body: JSON.stringify({
                imageId, year, localityId, eventId, personsIds
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        }).then((res) => res.json());

        // On good result delete the image from the properties and update cache variable
        if (updatedImage.result === true) {
            const imageStatusInput = document.getElementById('imageStatus');
            tag.properties.images[tag.properties.imageDisplayedIndex] = updatedImage.data;
            imageStatusInput.value = "taguée";
            imageStatusInput.classList.remove('imageNotTaggued');
            imageStatusInput.classList.add('imageTaggued');
            // if multi tag mode then go to next image
            if (document.querySelector('.project_h2Title').dataset.type === 'multiTagMode') {
                tag.displayImageInfo(1);
            } else {// if not then go to previous page
                tag.goToPreviousPage();
            }
        }
    },
    tagPersonOnScreen: () => {
        // create element personSpan in the personContainer
        const personContainer = document.getElementById('personContainer');
        const personTagSelectElt = document.getElementById('personTag');
        const selectOptions = personTagSelectElt.options;

        // get All the person id selected
        const personsArray = [];
        for (let i = 0; i < selectOptions.length; i++) {
            if (selectOptions[i].selected) {
                personsArray.push({
                    id: selectOptions[i].value,
                    name: selectOptions[i].text
                });
            }
        }

        // checking that at least one person was selected
        if (personsArray.length === '0') return;

        // loop on the personsIdArray and create elements in person container
        personsArray.forEach((person) => {
            const personSpan = document.createElement('span');
            personSpan.textContent = person.name;
            personSpan.classList.add('tagguedPerson');
            personSpan.dataset.personId = person.id;
            const crossIcon = document.createElement('span');
            crossIcon.innerHTML = '<i class="fa-solid fa-circle-xmark crossIcon"></i>';
            personSpan.appendChild(crossIcon);
            personContainer.appendChild(personSpan);
        })

        // add a script on the cross to enable remove of the newly taggued person
        tag.addDeleteTagguedPersonToCrossBtns();

        // remove the person from the select element
        // const personIndexToRemove = [];
        for (let i = 0; i < selectOptions.length; i++) {
            const isPerson = personsArray.find((person) => {
                return person.id == selectOptions[i].value
            })
            if (isPerson) {
                personTagSelectElt.remove(i);
                i--;
            }
        };
    },
    addDeleteTagguedPersonToCrossBtns: () => {
        const personsCrossBtns = document.querySelectorAll('.crossIcon');
        personsCrossBtns.forEach((person) => person.addEventListener('click', tag.deleteTagguedPerson));
    },
    getAllImagesAndLinkedTablesNotTaggued: async () => {
        const imagesAndLinkedTables = await fetch(`${BASE_URL}/images/getAllNotTagguedWithLinkedTables`).then((res) => res.json());
        tag.properties.images = imagesAndLinkedTables.data;
    },
    getOneImageAndLinkedTables: async (imageId) => {
        const imageInfo = await fetch(`${BASE_URL}/images/getImageInfoWithLinkedTables`, {
            method: 'POST',
            body: JSON.stringify({ imageId }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => res.json());
        tag.properties.images = imageInfo.data;

    },
    displayImageInfo: async (indexChange, recursif = false) => {
        console.log('indexChange: ' + indexChange);
        console.log('recursif: ' + recursif);
        // Remove from table being taggued current image as we go next
        if (indexChange !== 0 && recursif === false) {
            const imageId = tag.properties.images[tag.properties.imageDisplayedIndex].id;
            console.log('front ask to delete image Id : ' + imageId);
            await fetch(`${BASE_URL}/images/deleteBeingTagged`, {
                method: 'POST',
                body: JSON.stringify({
                    imageId,
                    socket: tag.properties.socket
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })

        } else {
            // Check that this image is not already being taggued, if yes, re-launch function
            const index = tag.properties.imageDisplayedIndex;
            const imageId = tag.properties.images[index].id;
            const imagesBeingTaggued = await fetch(`${BASE_URL}/images/beingTaggued`).then((res => res.json()));

            if (imagesBeingTaggued.data.find((img) => img.image_id == imageId)) {
                console.log('récursif');
                tag.displayImageInfo(1, true);
            }
        }

        // identify the img element container
        const imageContainer = document.getElementById('imageContainer');

        // initialize the rotation degree if it changed
        tag.properties.rotationDegree = 0;
        imageContainer.style.transform = `rotate(${tag.properties.rotationDegree}deg)`

        // calculate the newIndex
        const currentIndex = tag.properties.imageDisplayedIndex;
        if ((indexChange < 0 && currentIndex > 0) || (indexChange > 0 && currentIndex < tag.properties.images.length - 1)) {
            tag.properties.imageDisplayedIndex += indexChange;
        }
        // Check that this image is not already being taggued, if yes, re-launch function
        const newIndex = tag.properties.imageDisplayedIndex;
        const newImageId = tag.properties.images[newIndex].id;
        const imagesBeingTaggued = await fetch(`${BASE_URL}/images/beingTaggued`).then((res => res.json()));

        if (imagesBeingTaggued.data.find((img) => img.image_id == newImageId)) {
            indexChange > 0 ? indexChange++ : indexChange--;
            tag.displayImageInfo(indexChange);
        }

        // if it is not being taggued by someone else, then register image as being taggued 
        await fetch(`${BASE_URL}/images/insertOneAsBeingTaggued`, {
            method: 'POST',
            body: JSON.stringify({
                socket: tag.properties.socket,
                imageId: newImageId,
                fileName: tag.properties.images[newIndex].file_name
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        // Display corresponding image on Screen
        imageContainer.src = `${BASE_URL}/imagesApp/assets/images/${tag.properties.images[newIndex].file_name}`;
        imageContainer.dataset.imgId = newImageId

        // Display Persons
        const personContainer = document.getElementById('personContainer');
        personContainer.innerHTML = '';
        await tag.updateSelectFields();
        const persons = tag.properties.images[newIndex].person_name;
        const personTagSelectElt = document.getElementById('personTag');

        // check firstly that first person has an id - if yes then loop
        if (persons[0].id) {
            persons.forEach((person) => {
                const personSpan = document.createElement('span');
                personSpan.textContent = person.name;
                personSpan.classList.add('tagguedPerson');
                personSpan.dataset.personId = person.id;
                const crossIcon = document.createElement('span');
                crossIcon.innerHTML = '<i class="fa-solid fa-circle-xmark crossIcon"></i>';
                personSpan.appendChild(crossIcon);
                personContainer.appendChild(personSpan);

                // remove the taggued person from the select element
                for (let i = 0; i < personTagSelectElt.length; i++) {
                    if (parseInt(personTagSelectElt.options[i].value) === person.id)
                        personTagSelectElt.remove(i);
                };
            });
        }

        // add a script on the cross for the persons displayed
        tag.addDeleteTagguedPersonToCrossBtns();
        // Display File Name
        const fileNameInput = document.getElementById('fileNameInput');
        fileNameInput.value = tag.properties.images[newIndex].file_name;

        // Display File Year
        const imageYearInput = document.getElementById('imageYearInput');
        imageYearInput.value = tag.properties.images[newIndex].year;

        // Display Locality
        const localityTag = document.getElementById('localityTag');
        const localityId = tag.properties.images[newIndex].locality_id;
        if (localityId) {
            localityTag.value = tag.properties.images[newIndex].locality_id;
        } else {
            localityTag.value = 0;
        }

        // Display Event
        const eventTag = document.getElementById('eventTag');
        const eventId = tag.properties.images[newIndex].event_id;
        if (eventId) {
            eventTag.value = tag.properties.images[newIndex].event_id;
        } else {
            eventTag.value = 0;
        }

        // Display Tag boolean
        const imageStatusInput = document.getElementById('imageStatus');
        const booleanTag = tag.properties.images[newIndex].tag;
        if (booleanTag) {
            imageStatusInput.value = "taguée";
            imageStatusInput.classList.remove('imageNotTaggued');
            imageStatusInput.classList.add('imageTaggued');
        } else {
            imageStatusInput.value = "non taguée";
            imageStatusInput.classList.add('imageNotTaggued');
            imageStatusInput.classList.remove('imageTaggued');
        }
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

        // TODO query DB to remove person from Table image_person !!!!!maybe not
    },
    updateSelectFields: async () => {
        // update person field (x2)
        const persons = await fetch(`${BASE_URL}/tags/getPersons`).then((res) => res.json());
        const personSelectModification = document.getElementById('personSelectModification');
        const personSelectTag = document.getElementById('personTag');

        personSelectModification.options.length = 1; // delete current options before adding all options
        personSelectTag.options.length = 1; // delete current options before adding all options
        persons.data.forEach((person) => {
            const option = document.createElement("option");
            option.value = person.id;
            option.text = person.name;
            const optionCloned = option.cloneNode(true);
            personSelectModification.add(option);
            personSelectTag.add(optionCloned);
        });
        // ... and select a 0 value by default
        personSelectModification.value = 0;
        personSelectTag.value = 0;

        // update locality field
        const localities = await fetch(`${BASE_URL}/tags/getAllLocalities`).then((res) => res.json());
        const localitySelectModification = document.getElementById('localitySelectModification');
        const localitySelectTag = document.getElementById('localityTag');
        localitySelectModification.options.length = 1; // delete current options before adding all options
        localitySelectTag.options.length = 1; // delete current options before adding all options

        localities.data.forEach((locality) => {
            const option = document.createElement("option");
            option.value = locality.id;
            option.text = locality.name;
            const optionCloned = option.cloneNode(true);
            localitySelectTag.add(option);
            localitySelectModification.add(optionCloned);

        });
        // ... and select a 0 value by default
        localitySelectModification.value = 0;
        localitySelectTag.value = 0;

        // update events field
        const events = await fetch(`${BASE_URL}/tags/getAllEvents`).then((res) => res.json());
        const eventSelectModification = document.getElementById('eventSelectModification');
        const eventSelectTag = document.getElementById('eventTag');
        eventSelectModification.options.length = 1; // delete current options before adding all options
        eventSelectTag.options.length = 1; // delete current options before adding all options

        events.data.forEach((event) => {
            const option = document.createElement("option");
            option.value = event.id;
            option.text = event.name;
            const optionCloned = option.cloneNode(true);
            eventSelectTag.add(option);
            eventSelectModification.add(optionCloned);
        }); // ... and select a 0 value by default
        eventSelectModification.value = 0;
        eventSelectTag.value = 0;
    },
    createPerson: async (e) => {
        e.preventDefault();

        // get the input text and fetch it by POST to the API
        const personCreationInput = document.getElementById('personCreationInput');
        const personName = personCreationInput.value;

        // fetch
        const creationResult = await fetch(`${BASE_URL}/tags/person`, {
            method: 'POST',
            body: JSON.stringify({ personName: personName }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            },
        }).then((res) => res.json());

        if (creationResult.result === false) {
            return Swal.fire({
                title: 'Echec de la création',
                text: `${creationResult.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        };

        // update the select tag with the new Person
        tag.updateSelectFields();

        return Swal.fire({
            title: `Création effectuée`,
            text: `"${personName}" a bien été ajoutée à la Base de données`,
            icon: 'success',
            confirmButtonText: 'OK'
        });



    },
    deletePerson: async (e) => {
        e.preventDefault();

        // get the id from the option in the select input
        const personSelectModification = document.getElementById('personSelectModification');
        const personText = personSelectModification.options[personSelectModification.selectedIndex].text;
        const personId = personSelectModification.options[personSelectModification.selectedIndex].value;

        // fetch
        const deleteResult = await fetch(`${BASE_URL}/tags/person`, {
            method: 'DELETE',
            body: JSON.stringify({ personId: personId }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            },
        }).then((res) => res.json());

        if (deleteResult.result === false) {
            return Swal.fire({
                title: 'Echec de la suppression',
                text: `${deleteResult.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        };

        // update the select tag with the active Persons
        tag.updateSelectFields();

        return Swal.fire({
            title: `Suppression effectuée`,
            text: `"${personText}" a bien été supprimée de la Base de données`,
            icon: 'success',
            confirmButtonText: 'OK'
        });



    },
    modifyPerson: async (e) => {
        e.preventDefault();

        // get the id from the option in the select input
        const personSelectModification = document.getElementById('personSelectModification');
        const personText = personSelectModification.options[personSelectModification.selectedIndex].text;
        const personId = personSelectModification.options[personSelectModification.selectedIndex].value;
        const personModificationInput = document.getElementById('personModificationInput');
        const personName = personModificationInput.value;

        // fetch
        const modifyResult = await fetch(`${BASE_URL}/tags/person`, {
            method: 'PUT',
            body: JSON.stringify({ personId: personId, personName: personName }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            },
        }).then((res) => res.json());

        if (modifyResult.result === false) {
            return Swal.fire({
                title: 'Echec de la MAJ',
                text: `${modifyResult.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        };

        // update the select tag with the active Persons
        tag.updateSelectFields();

        return Swal.fire({
            title: `Modification effectuée`,
            text: `"${personText}" a bien été modifié dans la Base de données`,
            icon: 'success',
            confirmButtonText: 'OK'
        });



    },
    createLocality: async (e) => {
        e.preventDefault();

        // get the input text and fetch it by POST to the API
        const localityCreationInput = document.getElementById('localityCreationInput');
        const localityName = localityCreationInput.value;

        // fetch
        const creationResult = await fetch(`${BASE_URL}/tags/locality`, {
            method: 'POST',
            body: JSON.stringify({ localityName: localityName }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            },
        }).then((res) => res.json());

        if (creationResult.result === false) {
            return Swal.fire({
                title: 'Echec de la création',
                text: `${creationResult.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        };

        // update the select tag with the new Locality
        tag.updateSelectFields();

        return Swal.fire({
            title: `Création effectuée`,
            text: `"${localityName}" a bien été ajoutée à la Base de données`,
            icon: 'success',
            confirmButtonText: 'OK'
        });

    },
    deleteLocality: async (e) => {
        e.preventDefault();

        // get the id from the option in the select input
        const localitySelectModification = document.getElementById('localitySelectModification');
        const localityText = localitySelectModification.options[localitySelectModification.selectedIndex].text;
        const localityId = localitySelectModification.options[localitySelectModification.selectedIndex].value;

        // fetch
        const deleteResult = await fetch(`${BASE_URL}/tags/locality`, {
            method: 'DELETE',
            body: JSON.stringify({ localityId: localityId }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            },
        }).then((res) => res.json());

        if (deleteResult.result === false) {
            return Swal.fire({
                title: 'Echec de la suppression',
                text: `${deleteResult.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        };

        // update the select tag with the active Localities
        tag.updateSelectFields();

        return Swal.fire({
            title: `Suppression effectuée`,
            text: `"${localityText}" a bien été supprimée de la Base de données`,
            icon: 'success',
            confirmButtonText: 'OK'
        });



    },
    modifyLocality: async (e) => {
        e.preventDefault();

        // get the id from the option in the select input
        const localitySelectModification = document.getElementById('localitySelectModification');
        const localityText = localitySelectModification.options[localitySelectModification.selectedIndex].text;
        const localityId = localitySelectModification.options[localitySelectModification.selectedIndex].value;
        const localityModificationInput = document.getElementById('localityModificationInput');
        const localityName = localityModificationInput.value;

        // fetch
        const modifyResult = await fetch(`${BASE_URL}/tags/locality`, {
            method: 'PUT',
            body: JSON.stringify({ localityId: localityId, localityName: localityName }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            },
        }).then((res) => res.json());

        if (modifyResult.result === false) {
            return Swal.fire({
                title: 'Echec de la modification',
                text: `${modifyResult.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        };

        // update the select tag with the active Localities
        tag.updateSelectFields();

        return Swal.fire({
            title: `Modification effectuée`,
            text: `"${localityText}" a bien été modifié dans la Base de données`,
            icon: 'success',
            confirmButtonText: 'OK'
        });



    },
    createEvent: async (e) => {
        e.preventDefault();

        // get the input text and fetch it by POST to the API
        const eventCreationInput = document.getElementById('eventCreationInput');
        const eventName = eventCreationInput.value;

        // fetch
        const creationResult = await fetch(`${BASE_URL}/tags/event`, {
            method: 'POST',
            body: JSON.stringify({ eventName: eventName }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            },
        }).then((res) => res.json());

        if (creationResult.result === false) {
            return Swal.fire({
                title: 'Echec de la création',
                text: `${creationResult.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        };

        // update the select tag with the new Event
        tag.updateSelectFields();

        return Swal.fire({
            title: `Création effectuée`,
            text: `"${eventName}" a bien été ajoutée à la Base de données`,
            icon: 'success',
            confirmButtonText: 'OK'
        });

    },
    deleteEvent: async (e) => {
        e.preventDefault();

        // get the id from the option in the select input
        const eventSelectModification = document.getElementById('eventSelectModification');
        const eventText = eventSelectModification.options[eventSelectModification.selectedIndex].text;
        const eventId = eventSelectModification.options[eventSelectModification.selectedIndex].value;

        // fetch
        const deleteResult = await fetch(`${BASE_URL}/tags/event`, {
            method: 'DELETE',
            body: JSON.stringify({ eventId: eventId }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            },
        }).then((res) => res.json());

        if (deleteResult.result === false) {
            return Swal.fire({
                title: 'Echec de la suppression',
                text: `${deleteResult.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        };

        // update the select tag with the active Events
        tag.updateSelectFields();

        return Swal.fire({
            title: `Suppression effectuée`,
            text: `"${eventText}" a bien été supprimée de la Base de données`,
            icon: 'success',
            confirmButtonText: 'OK'
        });



    },
    modifyEvent: async (e) => {
        e.preventDefault();

        // get the id from the option in the select input
        const eventSelectModification = document.getElementById('eventSelectModification');
        const eventText = eventSelectModification.options[eventSelectModification.selectedIndex].text;
        const eventId = eventSelectModification.options[eventSelectModification.selectedIndex].value;
        const eventModificationInput = document.getElementById('eventModificationInput');
        const eventName = eventModificationInput.value;

        // fetch
        const modifyResult = await fetch(`${BASE_URL}/tags/event`, {
            method: 'PUT',
            body: JSON.stringify({ eventId: eventId, eventName: eventName }),
            headers: {
                'Content-Type': 'application/json',
                'authorization': tag.properties.token
            },
        }).then((res) => res.json());

        if (modifyResult.result === false) {
            return Swal.fire({
                title: 'Echec de la modification',
                text: `${modifyResult.message}`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
        };

        // update the select tag with the active Events
        tag.updateSelectFields();

        return Swal.fire({
            title: `Modification effectuée`,
            text: `"${eventText}" a bien été modifié dans la Base de données`,
            icon: 'success',
            confirmButtonText: 'OK'
        });



    },
};

document.addEventListener('DOMContentLoaded', tag.init);