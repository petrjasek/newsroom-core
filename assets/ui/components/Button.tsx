import React from 'react';
import classNames from 'classnames';

interface IProps {
    text: string;
    onClick(event: React.MouseEvent): void;
    size?: 'small';
    variant?: 'primary' | 'secondary' | 'tertiary';
    'data-test-id'?: string;
}

export function Button(props: IProps) {
    return (
        <button
            data-test-id={props['data-test-id']}
            onClick={props.onClick}
            className={classNames('nh-button', {
                'nh-button--small': props.size === 'small',
                'nh-button--primary': props.variant === 'primary',
                'nh-button--secondary': props.variant === 'secondary',
                'nh-button--tertiary': props.variant === 'tertiary',
            })}
        >
            {props.text}
        </button>
    );
}
