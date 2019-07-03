function SideMenuCtrl(SidebarJS) {
  this.toggleSidebarJS = function toggleSidebarJS(sidebarName) {
    SidebarJS.toggle(sidebarName);
  };

  this.isVisibleSidebarJS = function isVisibleSidebarJS(sidebarName) {
    return SidebarJS.isVisible(sidebarName);
  };

  this.onSidebarOpen = function onSidebarOpen() {
    console.log('is open!');
  };

  this.onSidebarClose = function onSidebarClose() {
    console.log('is close!');
  };

  this.onSidebarChangeVisibility = function onSidebarChangeVisibility(event) {
    console.log(event);
  };
}
/*
  .component('sidemenu', {
    controller: ['SidebarJS', SideMenuCtrl],
    controllerAs: 'sidemenu',
    templateUrl: './app.template.html',
  });*/
