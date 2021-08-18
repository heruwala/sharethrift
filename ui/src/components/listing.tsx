import React, {FC, ReactNode } from 'react';
import PropTypes, { InferProps } from 'prop-types';
import styles from './listing.module.css';

const ComponentPropTypes = {
  imageUrl: PropTypes.string,
  title: PropTypes.string,
  body: PropTypes.node,
}

interface ComponentProp {
  imageUrl?: string,
  title?: string,
  body?: ReactNode,
}

export type ComponentProps = InferProps<typeof ComponentPropTypes> & ComponentProp;

export const Listing: FC<ComponentProps> = ({
  imageUrl = 'https://images.unsplash.com/photo-1570169043013-de63774bbf97?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3300&q=80',
  title,
  body
  }) => {
    return <>
      <div className={styles['listing']}>
        <div className={styles['image-container']}>
          <img src={imageUrl} alt={title} className={styles['image']}/>
        </div>
        <div className={styles['content-container']}>
          <h5 className={styles['title']}>{title}</h5>
          {body}
        </div>
      </div>
    </>
}