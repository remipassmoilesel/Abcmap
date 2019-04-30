import {Component, OnDestroy, OnInit} from '@angular/core';
import {ProjectService} from '../../lib/project/project.service';
import {RxUtils} from "../../lib/utils/RxUtils";
import {Subscription} from "rxjs";
import {GuiRoutes} from '../../app-routing.module';

@Component({
  selector: 'abc-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {

  project$?: Subscription;
  routes = GuiRoutes;
  projectName = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.project$ = this.projectService.listenProjectState()
      .subscribe(project => this.projectName = project ? project.name : '');
  }

  ngOnDestroy() {
    RxUtils.unsubscribe(this.project$)
  }

  newProject() {
    this.projectService.createNewProject().subscribe();
  }

  closeProject() {
    throw new Error("Implement me")
  }

  saveProject() {
    this.projectService.saveProject().subscribe();
  }

}
