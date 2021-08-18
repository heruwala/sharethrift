import React from 'react';
import { ComponentStory, ComponentMeta} from '@storybook/react';
import { Listing }  from './listing';

export default {
  title: 'Components/Listing',
  component: Listing,
  argTypes: {
    content : { control: 'text'}
  },
  decorators: [
    (Story) => (
      <div style={{ width: '159px', height: '236px'}}>
        <Story/>
      </div>
    ),
  ],
} as ComponentMeta<typeof Listing>;

const Template: ComponentStory<typeof Listing> = (args) => <Listing {...args} />;

export const Default = Template.bind({});
Default.args = {
  imageUrl: 'https://images.unsplash.com/photo-1570169043013-de63774bbf97?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3300&q=80',
  title: 'City Bike',
  body: <>
    <div>3-7 days/request</div>
    <div>1 week advance notice </div>
    <div>reserve up to 1 month in advance</div>
  </>
};
Default.parameters = {
  zeplinLink : 'https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610e995d2dd80f10a35c78e8',
}