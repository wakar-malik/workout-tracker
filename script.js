if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const { latitude, longitude } = position.coords;

      console.log(latitude, longitude);
    },
    function () {
      alert("failed to get location........");
    }
  );
