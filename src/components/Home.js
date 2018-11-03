import React from 'react';
import $ from 'jquery';
import { CreatePostButton } from './CreatePostButton.js';
import { Tabs, Spin } from 'antd';
import { Gallery } from './Gallery';
import { WrappedAroundMap } from './AroundMap';
import { GEO_OPTIONS, POS_KEY, AUTH_PREFIX, TOKEN_KEY, API_ROOT } from "../constants";

const TabPane = Tabs.TabPane;

export class Home extends React.Component {
    state = {
        error: '',
        posts: [],
        loadingGeoLocation: false,
        loadingPosts: false,
    }

    componentDidMount() {
        this.setState({loadingGeoLocation: true, error: ''});
        this.getGeoLocation();
    }

    getGeoLocation = () => {
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
        this.setState({loadingPosts: true, loadingGeoLocation: false, error: ''});
        const {latitude, longitude} = position.coords;
        localStorage.setItem(POS_KEY, JSON.stringify({latitude, longitude}));

        //uploaded pictures
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
          return <Spin tip="Loading geolocation..."/>;
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

        // ES6 version:
        // } else if(this.state.posts!=null && this.state.posts.length>0){
        //     return <Gallery images = {
        //         this.state.posts.map(({ user, message, url }) => ({
        //             user: user,
        //             scr:url,
        //             thumbnail: url,
        //             caption: message,
        //             thumbnailWidth: 400,
        //             thumbnailHeight: 300
        //         }))
        //     } />; }

          return <Gallery images={images}/>;
        }
        else {
          return null;
        }
    }

    loadNearbyPosts = (location, range) => {
        const { latitude, longitude } = location || JSON.parse(localStorage.getItem(POS_KEY));
        this.setState({ loadingPosts: true, error: ''});
        const radius = range ? range : 20;
        //const token = localStorage.getItem(TOKEN_KEY);
        $.ajax({
          url: `${API_ROOT}/search?lat=${latitude}&lon=${longitude}&range=${radius}`,
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
        const createPostButton = <CreatePostButton loadNearbyPosts={this.loadNearbyPosts}/>;
        return (
            <Tabs tabBarExtraContent={createPostButton} className="main-tabs">
                <TabPane tab="Posts" key="1">
                    {this.getGalleryPanelContent()}

                </TabPane>
                <TabPane tab="Map" key="2">
                    <WrappedAroundMap
                        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD3CEh9DXuyjozqptVB5LA-dN7MxWWkr9s&v=3.exp&libraries=geometry,drawing,places"
                        containerElement={<div style={{ height: `500px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                        loadingElement={<div style={{ height: `100%` }} />}
                        posts={this.state.posts}
                        loadNearbyPosts={this.loadNearbyPosts}
                    />
                </TabPane>
            </Tabs>
        );
    }
}