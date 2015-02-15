(function(){

var CheckinController = function ($scope, $state, NativeCheckin, $ionicModal, $ionicLoading) {	

	$scope.checkinInfo = {footprintCaption: null};

	$scope.show = function() {
    $ionicLoading.show({
      content: '<i class="icon ion-load-c light"></i>',
      animation: 'fade-in'
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };

	$scope.searchFoursquareVenues = function () {
		$scope.show();
		NativeCheckin.getCurrentLocation()
		.then(function (location) {
			var currentLocation = {
				lat: location.coords.latitude,
				lng: location.coords.longitude
			};
		  // var currentLocation = {lat:40.753522 , lng: -74.272922}
			NativeCheckin.searchFoursquareVenues(window.sessionStorage.userFbID, currentLocation)
			.then(function (venues) {
				$scope.hide();
				$scope.venues = venues.data;
				console.log(venues.data);
			})
		});
	}

	$scope.passSelectedVenueInfoToPostModal = function (venueInfo) {
		$scope.venue = venueInfo;
		console.log(venueInfo);
	}

	$scope.sendCheckinDataToServer = function(venueInfo) {
		venueInfo.facebookID = window.sessionStorage.userFbID;
		venueInfo.footprintCaption = $scope.checkinInfo.footprintCaption;
		NativeCheckin.s3_upload()
		.then(function (public_url) {
		  venueInfo.photo = public_url;
		  console.log('venueInfo: ' + JSON.stringify(venueInfo));
		  NativeCheckin.sendCheckinDataToServer(venueInfo)
		})
		.then(function (data) {
			console.log(data);
		})
	}

	$scope.showCaption = function() {
		console.log($scope.checkinInfo.footprintCaption);
	}

	$scope.searchFoursquareVenues();

	$ionicModal.fromTemplateUrl('checkin-post.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });

};

CheckinController.$inject = ['$scope', '$state', 'NativeCheckin', '$ionicModal', '$ionicLoading']

angular.module('waddle.checkin', [])
  .controller('CheckinController', CheckinController);

})();