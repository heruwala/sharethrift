import React from 'react';
import { ComponentStory, ComponentMeta} from '@storybook/react';
import { Label, LabelType }  from './label';

export default {
  title: 'Components/Label',
  component: Label,
  argTypes: {
    content : { control: 'text'}
  },
  parameters: {
    zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?seid=610c5738ba4400628138a24a",
},

} as ComponentMeta<typeof Label>;
const Template: ComponentStory<typeof Label> = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: "Default"
};

export const RequestSubmitted = Template.bind({});
RequestSubmitted.args = {
  labelType: LabelType.RequestSubmitted,
  children: "Request Submitted"
};
RequestSubmitted.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610c573940080b645f26af70",
}

export const ListingDraft = Template.bind({});
ListingDraft.args = {
  labelType: LabelType.ListingDraft,
  children: "Listing Draft"
};
ListingDraft.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610c5738ab179673b931b2a5",
}

export const RequestAccepted = Template.bind({});
RequestAccepted.args = {
  labelType: LabelType.RequestAccepted,
  children: "Request Accepted"
};
RequestAccepted.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610c573a8d684a65fb7fee57",
}

export const PickupArranged = Template.bind({});
PickupArranged.args = {
  labelType: LabelType.PickupArranged,
  children: "Pickup Arranged"
};
PickupArranged.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610c573a55e203650f6b827e",
}

export const ReturnPending = Template.bind({});
ReturnPending.args = {
  labelType: LabelType.ReturnPending,
  children: "Return Pending"
};
ReturnPending.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610c573af0ba4b64378355ad",
}

export const ListingSubmitted = Template.bind({});
ListingSubmitted.args = {
  labelType: LabelType.ListingSubmitted,
  children: "Listing Submitted"
};
ListingSubmitted.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610c57393698e2621fdeb425",
}


export const ListingPosted = Template.bind({});
ListingPosted.args = {
  labelType: LabelType.ListingPosted,
  children: "Listing Posted"
};
ListingPosted.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610c5739d80d9763c4eed580",
}


export const ListingPaused = Template.bind({});
ListingPaused.args = {
  labelType: LabelType.ListingPaused,
  children: "Listing Paused"
};
ListingPaused.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610c5739c813b673d6b3dc7d",
}

export const UpdateNeeded = Template.bind({});
UpdateNeeded.args = {
  labelType: LabelType.UpdateNeeded,
  children: "Update Needed"
};
UpdateNeeded.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610c573965554761be81089e",
}

export const RequestReceived = Template.bind({});
RequestReceived.args = {
  labelType: LabelType.RequestReceived,
  children: "Request Received"
};
RequestReceived.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610c573ab640027612b5fce5",
}

export const RequestComplete = Template.bind({});
RequestComplete.args = {
  labelType: LabelType.RequestComplete,
  children: "Request Complete"
};
RequestComplete.parameters = {
  zeplinLink: "https://app.zeplin.io/styleguide/61018ccf9e8c509d2781c71c/components?coid=610e99860848dc16953f4ac0",
}