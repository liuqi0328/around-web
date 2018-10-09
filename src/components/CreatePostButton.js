import React from 'react';
import { Button, Modal } from 'antd';
import { WrappedCreatePostForm } from './CreatePostForm.js';

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
  
    handleOk = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
    }
  
    handleCancel = (e) => {
      console.log(e);
      this.setState({
        visible: false,
      });
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
                >
                    <WrappedCreatePostForm />
                </Modal>
            </div>
        );
    }
}