import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { API, graphqlOperation } from 'aws-amplify';

import * as Observable from 'zen-observable';

import { listRestaurants } from '../graphql/queries';
import { createRestaurant } from '../graphql/mutations';
import { onCreateRestaurant } from '../graphql/subscriptions';

// import { Restaurant } from '../../amplify/backend/api/RestaurantAPI/schema.graphql';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public createForm: FormGroup;
  restaurants: Array<any>;

  constructor(private formBuilder: FormBuilder) { }

  async ngOnInit() {
    this.createForm = this.formBuilder.group({
      'name': ['', Validators.required],
      'description': ['', Validators.required],
      'city': ['', Validators.required]
    });

    var subscription = API.graphql(graphqlOperation(onCreateRestaurant)
    ) as Observable;

    subscription.subscribe({
      next: (sourceData) => {
        const newRestaurant = (sourceData as any).value.data.onCreateRestaurant
        this.restaurants = [newRestaurant, ...this.restaurants];
      }
    });

    var response = await
      API.graphql(graphqlOperation(listRestaurants))
    this.restaurants = (response as any).data.listRestaurants.items;
  }

  public async onCreate(restaurant: any) {
    try {
      await API.graphql(graphqlOperation(createRestaurant, {
        input: restaurant
      }));
      console.log('item created!');
      this.restaurants = [restaurant, ...this.restaurants];
      this.createForm.reset();
    }
    catch (e) {
      console.log('error creating restaurant...', e);
    }
  }

}
