// main.js
const app = Vue.createApp({
  data() {
    return {
      searchText: '',
      buffetsList: [],
      selectedBuffet: null,
      buffetDetails: {
        eventTypes: []
      },
      availabilityResponse: null,
      availabilityParams: {
        date: '',
        guests: ''
      }
    };
  },

  computed: {
    listResult() {
      if (this.searchText) {
        return this.buffetsList.filter(buffet =>
          buffet.name.toLowerCase().includes(this.searchText.toLowerCase())
        );
      } else {
        return this.buffetsList;
      }
    }
  },

  methods: {
    async getData() {
      try {
        let response = await fetch('http://localhost:3000/api/v1/buffets');
        let data = await response.json();
        
        data.forEach(item => {
          var buffet = {
            id: item.id,
            name: item.name,
            city: item.city,
            state: item.state
          };
          this.buffetsList.push(buffet);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },

    async selectBuffet(buffet) {
      this.selectedBuffet = buffet;
      try {
        let response = await fetch(`http://localhost:3000/api/v1/buffets/${buffet.id}`);
        let data = await response.json();
        this.buffetDetails = data;

        let eventTypesResponse = await fetch(`http://localhost:3000/api/v1/buffets/${buffet.id}/event_types`);
        let eventTypesData = await eventTypesResponse.json();
        this.buffetDetails.eventTypes = eventTypesData;
      } catch (error) {
        console.error('Error fetching buffet details:', error);
      }
    },

    async checkAvailability(eventTypeId) {
      try {
        let response = await fetch(`http://localhost:3000/api/v1/availability_check?date=${this.availabilityParams.date}&guests=${this.availabilityParams.guests}&event_type_id=${eventTypeId}`);
        let data = await response.json();
        this.availabilityResponse = data;
        console.log(data);
      } catch (error) {
        console.error('Error checking availability:', error);
      }
    },

    deselectBuffet() {
      this.selectedBuffet = null;
      this.buffetDetails = {};
      this.availabilityResponse = null;
    }
  },

  mounted() {
    this.getData();
  }
});

app.mount('#app');
