import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MenuController } from 'ionic-angular';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserFields } from '../../graphql/types/types';
import { ChannelsService } from '../chat-view/channels.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Component({
  selector: 'app-main-sidenav',
  templateUrl: './main-sidenav.component.html',
  styleUrls: ['./main-sidenav.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainSidenavComponent implements OnInit {

  public user: UserFields.Fragment;
  public channels: Observable<any>;
  public channelsNum: number;
  public directChannels: Observable<any>;
  public directChannelsNum: number;

  constructor(private router: Router,
              private menuCtrl: MenuController,
              private authenticationService: AuthenticationService,
              private myChannelService: ChannelsService) {
  }

  ngOnInit(): void {
    this.user = this.authenticationService.getUser();

    this.directChannels = this.myChannelService.getMyChannels()
      .filter(result => !!result.data && !!result.data.channelsByUser)
      .map(result => result.data.channelsByUser.filter(channel => channel.direct))
      .do(channels => this.directChannelsNum = channels.length);

    this.channels = this.myChannelService.getMyChannels()
      .filter(result => !!result.data && !!result.data.channelsByUser)
      .map(result => result.data.channelsByUser.filter(channel => !channel.direct))
      .do(channels => this.channelsNum = channels.length);

  }

  async logout() {
    await this.authenticationService.logout();
    this.router.navigate(['login']);
  }

  closeSideNav() {
    this.menuCtrl.close();
  }
}
