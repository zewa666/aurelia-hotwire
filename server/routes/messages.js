const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');

const router = Router();
const messages = [];

router.post('/api/messages', async (req, res) => {
  const { title, body } = req.fields;

  if (!title || !body) {
    await res.turboStream.multiple((turboStream) => [
      turboStream.update('new_message_body_frame', {
        partial: 'messages/validation',
        locals: {
          field: "body",
          error: !body
        },
      }),
      turboStream.update('new_message_title_frame', {
        partial: 'messages/validation',
        locals: {
          field: "title",
          error: !title
        },
      })
    ]);

    return;
  }

  const message = {
    id: "msg_" + uuidv4(),
    title,
    body
  }
  messages.push(message);

  // Make sure the first argument matches the HTML element id that you want to append a child to
  await res.turboStream.multiple((turboStream) => [
    turboStream.append('messages', {
      partial: 'messages/show',
      locals: {
        message
      },
    }),
    turboStream.update('new_message_body_frame', {
      partial: 'messages/validation',
      locals: {
        field: "body",
        error: false
      },
    }),
    turboStream.update('new_message_title_frame', {
      partial: 'messages/validation',
      locals: {
        field: "title",
        error: false
      },
    })
  ]);
});

router.delete('/api/messages/:messageId', async (req, res) => {
  const { messageId } = req.params;

  const idx = messages.findIndex(m => m.id === messageId);

  if (idx >= 0) {
    messages.splice(idx, 1);

    await res.turboStream.remove(`${messageId}`);
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
