import {
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialog as GUAlertDialog,
} from '../ui/alert-dialog';
import { Button, ButtonText } from '../ui/button';
import { Text } from '../ui/text';
export function AlertDialog({
  isOpen,
  title,
  description,
  closeBtnText,
  onClose,
  onSubmit,
  submitBtnText,
}: {
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  title?: string;
  description?: string;
  closeBtnText?: string;
  submitBtnText?: string;
}) {
  return (
    <GUAlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        {title && (
          <AlertDialogHeader>
            <Text>{title}</Text>
          </AlertDialogHeader>
        )}
        {description && (
          <AlertDialogBody>
            <Text>{description}</Text>
          </AlertDialogBody>
        )}
        <AlertDialogFooter>
          {closeBtnText && (
            <Button onPress={onClose}>
              <ButtonText>{closeBtnText}</ButtonText>
            </Button>
          )}
          {submitBtnText && (
            <Button onPress={onSubmit}>
              <ButtonText>{submitBtnText}</ButtonText>
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </GUAlertDialog>
  );
}
