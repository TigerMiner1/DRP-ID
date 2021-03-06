const DRP_Characters = new Vue({
  el: "#DRP_Characters",

  data: {
    // Shared
    ResourceName: "drp_id",
    showCharacterSpawnMenu: false,
    showCharacterSelector: false,
    showCharacterCreator: false,
    showCharacterDelete: false,
    showDisconnectQuestion: false,
    showCharacterVehicles: false,

    // Character Selector
    characters: [],
    characterID: [],
    vehicles: [],

    // Character Creator
    genders: ["Male", "Female"],

    selectedFirstname: "",
    selectedLastname: "",
    selectedGender: "",
    selectedDeleteCharacter: "",
    selectedSpawnArea: "",

    spawn: "",
    ped: "",
    selectedDob: "",
    selectedAge: "",

    nameRules: [
      v => !!v || "Name required",
      v => (!!v && v.length <= 15) || "Name must be 15 characters or less",
      v => (!!v && RegExp("^[a-zA-Z]+$").test(v)) || "Invalid Characters",
      v => (!!v && v.length >= 4) || "Name must be 4 - 15 characters"
    ],
    genderRules: [
      v => !!v || "Gender Required, you can't be an Attack Helicopter... sorry!"
    ],
    dobRules: [
      (v) => !!v || "You must choose have a Data of birthday"
    ],
    ageRules: [
        (v) => !!v && v >= 18 || "You must be 18+ to create a character",
        (v) => !!v && v <= 65 || "You must be less than 65 to create a character"
    ]
  },

  methods: {
    // START OF MAIN MENU
    OpenCharactersMenu(characters) {
      this.showCharacterSelector = true;
      this.characters = characters;
    },

    OpenSpawnSelectionMenu(ped, spawn) {
      this.showCharacterSpawnMenu = true;
      this.ped = ped;
      this.spawn = spawn;
    },

    CloseCharactersMenu() {
      axios
        .post(`http://${this.ResourceName}/CloseMenu`, {})
        .then(response => {
          this.showCharacterCreator = false;
          this.showCharacterSelector = false;
        })
        .catch(error => {});
    },

    CloseSpawnSelectionMenu() {
      axios
        .post(`http://${this.ResourceName}/CloseSpawnSelectionMenu`, {})
        .then(response => {
          this.showCharacterSpawnMenu = false;
        })
        .catch(error => {});
    },

    SpawnLocation() {
      axios
        .post(`http://${this.ResourceName}/SpawnLocation`, {
          locationName: this.selectedSpawnArea,
          ped: this.ped
        })
        .then(response => {})
        .catch(error => {});
    },

    LastPositionSpawnPreview() {
      var LastLocation = this.characters[characterID].lastLocation
      axios
      .post(`http://${this.ResourceName}/LastPositionSpawnPreview`, {
        ped: this.ped,
        spawn: LastLocation
      })
      .then(response => {})
      .catch(error => {});
    },

    GarageSpawnPreview() {
      axios
        .post(`http://${this.ResourceName}/GarageSpawnPreview`, {
          ped: this.ped,
          spawn: [279.7169, -345.4529, 44.91983]
        })
        .then(response => {})
        .catch(error => {});
    },

    TrainStationPreview() {
      axios
        .post(`http://${this.ResourceName}/TrainStationPreview`, {
          ped: this.ped,
          spawn: [-211.3702, -1021.899, 30.14071]
        })
        .then(response => {})
        .catch(error => {});
    },

    SandyShorePreview() {
      axios
        .post(`http://${this.ResourceName}/SandyShorePreview`, {
          ped: this.ped,
          spawn: [1816.91, 3660.19, 34.28] // These Coords Need Changing
        })
        .then(response => {})
        .catch(error => {});
    },

    UpdateCharacters(characters) {
      this.characters = characters;
      if (this.showCharacterCreator == false) {
        this.FormReset();
      }
    },

    CreateCharacter() {
      if (this.$refs.DRPCreatorForm.validate()) {
        axios
          .post(`http://${this.ResourceName}/CreateCharacter`, {
            name: `${FixName(this.selectedFirstname)} ${FixName(
              this.selectedLastname
            )}`,
            age: this.selectedAge,
            gender: this.selectedGender,
            dob: this.selectedDob
          })
          .then(response => {
            this.showCharacterCreator = false;
          })
          .catch(error => {});
      }
    },

    SelectCharacter(index) {
      console.log(`CHARACTER ID: ${this.characters[index].id}`);
      characterID = index;
      this.showCharacterSelector = false;
      var character_info = this.characters[index].id;
      axios
        .post(`http://${this.ResourceName}/SelectYourCharacter`, {
          character_selected: character_info
        })
        .then(response => {})
        .catch(error => {});
    },

    DisconectMe() {
      this.showDisconnectQuestion = false;
      axios
        .post(`http://${this.ResourceName}/DisconnectMe`, {})
        .then(response => {})
        .catch(error => {});
    },

    DeleteCharacter() {
      this.showCharacterDelete = false;
      var chosen_character = this.characters[this.selectedDeleteCharacter].id;
      axios
        .post(`http://${this.ResourceName}/DeleteCharacter`, {
          character_id: chosen_character
        })
        .then(response => {})
        .catch(error => {});
    },

    RequestDeleteCharacter(index) {
      this.selectedDeleteCharacter = index;
      this.showCharacterDelete = true;
    },

    FormReset() {
      this.$refs.DRPCreatorForm.reset();
      this.selectedAge = 0;
    },

    ShowVehicles(charid) {
      var characterid = this.characters[charid].id
      axios.post(`http://${this.ResourceName}/GetCharacterVehicles`, { character_id: characterid })
      .then(response => {})
      .catch(error => {});
    },

    OpenVehicleList(vehicles) {
      this.vehicles = vehicles
      this.showCharacterVehicles = true
      this.showCharacterSelector = false
    },

    numberformat(value) {
      let val = (value/1).toFixed(0).split('.')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }
  },

  watch: {
    "selectedDob" : (val, oldVal) => {
        if(val != oldVal) {
          DRP_Characters.selectedAge = GetAge(DRP_Characters.selectedDob);
        }
    },
  }
});

///////////////////////////////////////////////////////////////////////////
// Gets the age from a dob string
///////////////////////////////////////////////////////////////////////////
function GetAge(string) {
  console.log("work?")
  var today = new Date();
  var birthDate = new Date(string);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age = age - 1;
  }
  return age;
};

function FixName(name) {
  var newName = "";
  for (var a = 0; a < name.length; a++) {
    if (a == 0) {
      newName = name[a].toUpperCase();
    } else {
      var concat = newName + name[a].toLowerCase();
      newName = concat;
    }
  }
  return newName;
}

// Listener from Lua CL
document.onreadystatechange = () => {
  if (document.readyState == "complete") {
    window.addEventListener("message", event => {
      ///////////////////////////////////////////////////////////////////////////
      // Character Main Menu
      ///////////////////////////////////////////////////////////////////////////

      if (event.data.type == "open_character_menu") {
        DRP_Characters.OpenCharactersMenu(event.data.characters);
      } else if (event.data.type == "update_character_menu") {
        DRP_Characters.UpdateCharacters(event.data.characters);
      } else if (event.data.type == "open_spawnselection_menu") {
        DRP_Characters.OpenSpawnSelectionMenu(event.data.ped, event.data.spawn);
      } else if (event.data.type == "open_vehicle_list") {
        DRP_Characters.OpenVehicleList(event.data.vehicles);
      } else if (event.data.type == "close_spawnselection_menu") {
        DRP_Characters.CloseSpawnSelectionMenu();
      }
    });
  }
};
