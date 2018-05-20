import Vue from 'vue';

/**
 * v-keys directive is to handle key events when no focus is
 * given to the component (like when component is a <div>)
 *
 * v-keys:arg.modifier="callback"
 * Example: v-keys:always.escape="callback"
 *
 * callback should be a function which will be called when events are triggered
 * It is called with the event (keydown) as first argument.
 *
 * arg: 
 * allfocus: capture the event even if focus is given to another component.
 * always: capture the event in all previous cases.
 * 
 * modifiers:
 * .escape: event is triggered only if key down is 'escape'
 * .enter: event is triggered only if key down is 'enter'
 * .<number>: event is triggered only if key down is the key code given
 * 
 * if several modifiers, it triggers if any modifiers is true.
 * if no modifiers, it always triggers (depending on arg).
 */
const keys = Vue.directive('keys', {
	bind: function(el, binding) {
        binding.callback = binding.def.keydown(el, binding);
		window.addEventListener('keydown', binding.callback);
	},
	unbind: function(el, binding) {
        window.removeEventListener('keydown', binding.callback);
    },
    keydown: function (el, binding) {
        const callback = binding.value;
        const arg = binding.arg;
        const modifiers = Object.entries(binding.modifiers).filter(([k, v]) => v);

        const notFocus = [
            'always', 'allfocus', 'allFocus'
        ].includes(arg);

        return (evt) => {
            const keyCode = evt.keyCode;
            const eKey = evt.key;
            const key = eKey && eKey.toLowerCase();

            // check depending on context
            if (!notFocus) {
                let elFocused = document.querySelector(':focus');
                if (elFocused && elFocused !== el) {
                    return;
                }
            }

            // filter depending on modifiers
            if (modifiers.length && modifiers.every(([k,]) => {
                return +k !== keyCode && k !== key;
            })) {
                return;
            }

            // trigger the event
            callback(evt);
        };
    },
});

export default keys;
