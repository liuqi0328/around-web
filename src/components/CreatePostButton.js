import React from 'react';
import $ from 'jquery';
import { Button, Modal, message } from 'antd';
import { WrappedCreatePostForm } from './CreatePostForm.js';
import { POS_KEY, API_ROOT, AUTH_PREFIX, TOKEN_KEY, LOC_SHAKE } from '../constants.js';

export class CreatePostButton extends React.Component {
    state = {
        visible: false,
        confirmLoading: false,
    }

    showModal = () => {
      this.setState({
        visible: true,
      });
    }

    handleOk = () => {
      this.setState({confirmLoading: true});
      this.form.validateFields((err, values) => {
          if (!err) {
              const { latitude, longitude } = JSON.parse(localStorage.getItem(POS_KEY));
              console.log(values);
              console.log(`${latitude} ${longitude}`);

              const formData = new FormData();
              formData.set('lat', latitude + Math.random() * 2 * LOC_SHAKE - LOC_SHAKE );
              formData.set('lon', longitude);
              formData.set('message', values.message);
              formData.set('image', values.image[0].originFileObj);

              $.ajax({
                  url: `${API_ROOT}/post`,
                  method: 'POST',
                  data: formData,
                  headers: {
                      Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`,
                  },
                  processData: false,
                  contentType: false,
                  dataType: 'text',
              }).then(
                  () => {
                    message.success('Created a post successfully!');
                    this.form.resetFields();
                    this.setState({ visible: false, confirmLoading: false });
                    this.props.loadNearbyPosts();
              }, (response) => {
                  message.error(response.responseText);
                  this.setState({ visible: false, confirmLoading: false });
              }).catch((error) => {
                  console.log(error);
              });
          }
      });
    //   this.setState({
    //     visible: false,
    //   });
    }

    handleCancel = () => {
      console.log('clicked cancel button');
      this.setState({
        visible: false,
      });
    }

    saveFormRef = (form) => {
        this.form = form;
    }

    render() {
        return (
            <div>
                <Button type="primary" onClick={this.showModal}>Create New Post</Button>
                <Modal
                    title="Create New Post"
                    visible={this.state.visible}
                    confirmLoading={this.state.confirmLoading}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="Create"
                >
                    <WrappedCreatePostForm ref={this.saveFormRef}/>
                </Modal>
            </div>
        );
    }
}