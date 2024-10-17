import { createVNode, render } from 'vue';
import { NPopconfirm, NButton } from 'naive-ui';
import { defineNuxtPlugin } from '#app';

interface PopConfirmOptions {
    title?: string;
    positiveText?: string;
    negativeText?: string;
    onPositiveClick?: () => void;
    onNegativeClick?: () => void;
}

export default defineNuxtPlugin((nuxtApp) => {
    const popConfirm = ({ title = '确认操作', positiveText = '确认', negativeText = '取消', onPositiveClick, onNegativeClick }: PopConfirmOptions) => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const vm = createVNode(NPopconfirm, {
            show: true,
            'title': title,
            'positive-text': positiveText,
            'negative-text': negativeText,
            'on-positive-click': () => {
                if (onPositiveClick) onPositiveClick();
                close();
            },
            'on-negative-click': () => {
                if (onNegativeClick) onNegativeClick();
                close();
            },
        }, {
            trigger: () => createVNode(NButton, { onClick: () => (vm.component as any).props.show = true }, { default: () => '触发按钮' })
    });

        function close() {
            render(null, container);
            document.body.removeChild(container);
        }

        render(vm, container);
    };

    nuxtApp.provide('popConfirm', popConfirm);
});
