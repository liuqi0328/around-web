import React from 'react';
import $ from 'jquery';
import { Tabs, Button, Spin } from 'antd';
import { Gallery } from './Gallery';
import { GEO_OPTIONS, POS_KEY, AUTH_PREFIX, TOKEN_KEY, API_ROOT } from "../constants";

const TabPane = Tabs.TabPane;

const operations = <Button>Extra Action</Button>;

export class Home extends React.Component {
    state = {
        error: '',
        loadingGeoLocation: false,
    }

    componentDidMount() {
        this.setState({loadingGeoLocation: true, error: ''});
        this.getGeoLocatioin();
    }

    getGeoLocatioin = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                this.onSuccessLoadGeoLocation,
                this.onFailLoadGeoLocation,
                GEO_OPTIONS,
            );
        } else {
            this.setState({error: 'Your browser does not support geolocation.'});
        }
    }

    onSuccessLoadGeoLocation = (position) => {
        console.log(position);
        this.setState({loadingGeoLocation: false, error: ''});
        const {latitude, longitude} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({latitude, longitude}));
        this.loadNearbyPosts();
    }

    onFailLoadGeoLocation = (error) => {
        // console.log(error);
        this.setState({loadingGeoLocation: false, error: 'Failed to load geolocation!'});
    }

    getGalleryPanelContent = () => {
        if (this.state.error) {
          return <div>{this.state.error}</div>;
        } else if (this.state.loadingGeoLocation) {
          return <Spin tip="Loading geo location..."/>;
        } else if (this.state.loadingPosts) {
          return <Spin tip="Loading posts..."/>;
        } else if (this.state.posts && this.state.posts.length > 0) {
          const images = this.state.posts.map((post) => {
            return {
              user: post.user,
              src: post.url,
              thumbnail: post.url,
              thumbnailWidth: 400,
              thumbnailHeight: 300,
              caption: post.message,
            }
          });
          return <Gallery images={images}/>;
        }
        else {
          return null;
        }
    }     

    loadNearbyPosts = () => {
        const { lat, lon } = JSON.parse(localStorage.getItem(POS_KEY));
        this.setState({ loadingPosts: true, error: ''});
        $.ajax({
          url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20000`,
          method: 'GET',
          headers: {
            Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
          },
        }).then((response) => {
          this.setState({ posts: response, loadingPosts: false, error: '' });
          console.log(response);
        }, (error) => {
          this.setState({ loadingPosts: false, error: error.responseText });
          console.log(error);
        }).catch((error) => {
          console.log(error);
        });
      }
     
    render() {
        return (
            <Tabs tabBarExtraContent={operations} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}
                    {/* Content of tab 1 */}
                </TabPane>
                <TabPane tab="Map" key="2">Content of tab 2</TabPane>
            </Tabs>
        );
    }
}