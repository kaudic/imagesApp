const tag = {
    init: () => {
        console.log('tag script initialisation...');
        tag.addEventsToAction();
    },
    addEventsToAction: () => {
        // Identify Elements


        const personCreationBtn = document.getElementById('personCreationBtn');
        personCreationBtn.addEventListener('click', tag.createPerson);

        const personSelectModification = document.getElementById('personSelectModification');
        const personModificationInput = document.getElementById('personModificationInput');
        const personModificationBtn = document.getElementById('personModificationBtn');
        const personDeleteBtn = document.getElementById('personDeleteBtn');

        const localityCreationInput = document.getElementById('localityCreationInput');
        const localityCreationBtn = document.getElementById('localityCreationBtn');
        const localitySelectModification = document.getElementById('localitySelectModification');
        const localityModificationInput = document.getElementById('localityModificationInput');
        const localityModificationBtn = document.getElementById('localityModificationBtn');
        const localityDeleteBtn = document.getElementById('localityDeleteBtn');

        const eventCreationInput = document.getElementById('eventCreationInput');
        const eventCreationBtn = document.getElementById('eventCreationBtn');
        const eventSelectModification = document.getElementById('eventSelectModification');
        const eventModificationInput = document.getElementById('eventModificationInput');
        const eventModificationBtn = document.getElementById('eventModificationBtn');
        const eventDeleteBtn = document.getElementById('eventDeleteBtn');

    },
    createPerson: async (e) => {
        e.preventDefault();

        // get the input text and fetch it by POST to the API
        const personCreationInput = document.getElementById('personCreationInput');
        const personName = personCreationInput.value;

        // fetch
        const creationResult = await fetch('/tags/personCreation', {
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

        return Swal.fire({
            title: `Création effectuée`,
            text: `"${personName}" a bien été ajoutée à la Base de données`,
            icon: 'success',
            confirmButtonText: 'OK'
        });



    }
};

document.addEventListener('DOMContentLoaded', tag.init);