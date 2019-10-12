import { Component, OnInit } from '@angular/core';
// import { API, graphqlOperation } from '../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import { listRestaurants } from '../graphql/queries';
// import { Restaurant } from '../API';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  restaurants: Array<Restaurant>;

  async ngOnInit() {
    var response = await
      API.graphql(graphqlOperation(listRestaurants))
    this.restaurants = (response as any).data.listRestaurants.items;
  }
}
