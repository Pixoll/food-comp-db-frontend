import React from 'react'
import { NewRefVolume, NewVolume } from './NewReference'
import { Journal, JournalVolume, Volume } from './getters/UseReferences'
type NewVolumeByReferenceProps = {
  data: {
    journals: Journal[];
    journalVolumes: JournalVolume[];
    volumes: Volume[];
  };
  dataForm: {
    refVolumeId?: number;
    newRefVolume?: NewRefVolume;
  };
};

const NewVolumeByReference: React.FC<NewVolumeByReferenceProps> = ({
  data,
  dataForm,
}) => {
  const { journals, journalVolumes, volumes } = data;
  const { newRefVolume , refVolumeId} = dataForm;
  return(
    <div>NewVolume</div>
  )
}

export default NewVolumeByReference;
