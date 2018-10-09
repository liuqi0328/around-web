import React from 'react';
import { Form, Input, Icon } from 'antd';

const FormItem = Form.Item;

export class CreatePostForm extends React.Component {
    
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form>
                <FormItem>
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                })(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                )}
                </FormItem>
            </Form>
        );
    }
}

export const WrappedCreatePostForm = Form.create()(CreatePostForm);