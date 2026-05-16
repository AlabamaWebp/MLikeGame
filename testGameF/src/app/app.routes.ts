import { Routes } from '@angular/router';
import { NicknameComponent } from './components/nickname/nickname.component';
import { HomeComponent } from './components/home/home.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { MunchkinComponent } from './components/munchkin/munchkin.component';
import { CardComponent } from './components/munchkin/card/card.component';
import { CardCreatorComponent } from './components/card-creator/card-creator.component';

export const routes: Routes = [
    {path: "test", loadComponent: () => CardComponent},
    {path: "start", loadComponent: () => NicknameComponent},
    {path: "home", loadComponent: () => HomeComponent},
    {path: "lobby", loadComponent: () => LobbyComponent},
    {path: "game", loadComponent: () => MunchkinComponent},
    {path: "test", loadComponent: () => CardComponent},
    {path: "create", loadComponent: () => CardCreatorComponent},
    {path: "**", redirectTo: "start"}

];
