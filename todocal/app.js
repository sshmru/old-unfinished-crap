var app = angular.module('calApp', [])

app.factory('taskFact', [
  function() {
    var factory = {}
    factory.currDay = {tasks:[]}
    factory.data = {
      2015: {
        1: {
          24: [
            {
              name: 'randomtask1',
              descr: 'meh2'
            }, {
              name: 'randomtask',
              descr: 'meh'
            }
          ],
          27: [
            {
              name: 'asdasd',
              descr: 'meh2'
            }, {
              name: 'aesdaweqwreqwre',
              descr: 'meh'
            }
          ]
        }
      }
    }

    factory.setDay = function(date) {
      var date = new Date(date)
      var year = date.getYear()+1900
      var month = date.getMonth()+1
      var day = date.getDate()
      //ensure the year/month/day obj is created
      if(!factory.data[year]){
        factory.data[year] = {}
      } 
      if(!factory.data[year][month]){
        factory.data[year][month] = {}
      } 
      if(!factory.data[year][month][day]){
        factory.data[year][month][day] = []
      } 
      factory.currDay.tasks = factory.data[year][month][day]
    }
    factory.setDay(Date.now())

    factory.addTask = function(taskObj){
      var temp = {}
      for(var prop in taskObj){
        if(taskObj.hasOwnProperty(prop)){
          temp[prop] = taskObj[prop]
        }
      }
      factory.currDay.tasks.push(temp)
    }

    return factory
  }
])

app.controller('dayTaskCtrl', ['$scope', 'taskFact',
  function($scope, taskFact) {
    $scope.currDay = taskFact.currDay
    $scope.newTask = {}
    $scope.addTask = function(taskObj) {
      taskFact.addTask(taskObj)
    }
  }
])

app.controller('dayGoalCtrl', ['$scope', 'taskFact',
  function($scope, taskFact) {
    $scope.currDay = taskFact.currDay
    $scope.newTask = {}
    $scope.addTask = function(taskObj) {
      taskFact.addTask(taskObj)
    }
  }
])

app.controller('calendarCtrl', ['$scope', 'taskFact',
  function($scope, taskFact) {
    $scope.month = []
    $scope.currMonth = new Date()//actually its date from which we extract the month

    //month view rounded to 6 full weeks
    $scope.getMonthDays = function(day) {
      alert(day)
      var day = new Date(day)//day is object so its passed by reference, clone it
      day.setMonth(day.getMonth(), 1)
      day.setDate(-day.getDay())
      var month = []
      while (month.length < 42) {
        month.push(new Date(day.setDate(day.getDate() + 1)).getTime())
      }
      $scope.month = month;
      $scope.weeks = $scope.chunks($scope.month, 7)
    }

    //stupid ng-repeat has no good way to split array into pieces for table cells
    $scope.chunks = function(arr, size) {
      var temp = []
      for (var i = 0; i < arr.length; i += size) {
        temp.push(arr.slice(i, i + size))
      }
      return temp
    }

    //actual structure linked to ng repeat

    $scope.cal = function(date) {
      taskFact.setDay(date)
    }

    $scope.setMonth = function(num){
      var date = new Date()
      date.setDate(15) //IMPORTANT 31 JAN INCREASED BY 1 MONTH GIVES 3 MARCH
      if(num !== 0){//back to current month
        date.setMonth($scope.currMonth.getMonth()+num)
      }
      $scope.getMonthDays(date)
      $scope.currMonth = date
    }

    $scope.setMonth(0)//current month
  }
])

app.filter('modulo', function() { //copypasta stackoverflow CD..
  return function(arr, div, val) {
    return arr.filter(function(item, index) {
      return index % div === (val || 0);
    })
  };
});
