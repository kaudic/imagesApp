const tag = {
    init: () => {
        console.log('tag script initialisation...');
        tag.addEventsToAction();
        tag.updateSelectFields();
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

    },
    updateSelectFields: async () => {
        // update person field
        const persons = await fetch('tags/getPersons').then((res) => res.json());
        const personSelectModification = document.getElementById('personSelectModification');
        personSelectModification.options.length = 0; // delete current options before adding all options
        persons.data.forEach((person) => {
            const option = document.createElement("option");
            option.value = person.id;
            option.text = person.name;
            personSelectModification.add(option);
        });

        // update locality field
        const localities = await fetch('tags/getAllLocalities').then((res) => res.json());
        const localitySelectModification = document.getElementById('localitySelectModification');
        localitySelectModification.options.length = 0; // delete current options before adding all options

        localities.data.forEach((locality) => {
            const option = document.createElement("option");
            option.value = locality.id;
            option.text = locality.name;
            localitySelectModification.add(option);
        });

        // update events field
        const events = await fetch('tags/getAllEvents').then((res) => res.json());
        const eventSelectModification = document.getElementById('eventSelectModification');
        eventSelectModification.options.length = 0; // delete current options before adding all options

        events.data.forEach((event) => {
            const option = document.createElement("option");
            option.value = event.id;
            option.text = event.name;
            eventSelectModification.add(option);
        });
    },
    createPerson: async (e) => {
        e.preventDefault();

        // get the input text and fetch it by POST to the API
        const personCreationInput = document.getElementById('personCreationInput');
        const personName = personCreationInput.value;

        // fetch
        const creationResult = await fetch('/tags/person', {
            method: 'POST',
            body: JSON.stringify({ personName: personName }),
            headers: {
                'Content-Type': 'application/json',
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
        const deleteResult = await fetch('/tags/person', {
            method: 'DELETE',
            body: JSON.stringify({ personId: personId }),
            headers: {
                'Content-Type': 'application/json',
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
        const modifyResult = await fetch('/tags/person', {
            method: 'PUT',
            body: JSON.stringify({ personId: personId, personName: personName }),
            headers: {
                'Content-Type': 'application/json',
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
        const creationResult = await fetch('/tags/locality', {
            method: 'POST',
            body: JSON.stringify({ localityName: localityName }),
            headers: {
                'Content-Type': 'application/json',
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
        const deleteResult = await fetch('/tags/locality', {
            method: 'DELETE',
            body: JSON.stringify({ localityId: localityId }),
            headers: {
                'Content-Type': 'application/json',
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
        const modifyResult = await fetch('/tags/locality', {
            method: 'PUT',
            body: JSON.stringify({ localityId: localityId, localityName: localityName }),
            headers: {
                'Content-Type': 'application/json',
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
        const creationResult = await fetch('/tags/event', {
            method: 'POST',
            body: JSON.stringify({ eventName: eventName }),
            headers: {
                'Content-Type': 'application/json',
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
        const deleteResult = await fetch('/tags/event', {
            method: 'DELETE',
            body: JSON.stringify({ eventId: eventId }),
            headers: {
                'Content-Type': 'application/json',
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
        const modifyResult = await fetch('/tags/event', {
            method: 'PUT',
            body: JSON.stringify({ eventId: eventId, eventName: eventName }),
            headers: {
                'Content-Type': 'application/json',
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