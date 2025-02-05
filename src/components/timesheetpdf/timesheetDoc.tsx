import React from 'react';
import { Page, Text, View, Document, PDFViewer } from '@react-pdf/renderer';
import { styles } from './style';

export default function TimesheetPDF() {
	const TimesheetDoc = () => (
		<Document>
			<Page size="A4" style={styles.page}>
				<View style={styles.section}>
					<Text>Section #1</Text>
				</View>
				<View style={styles.section}>
					<Text>Section #2</Text>
				</View>
			</Page>
		</Document>
	);
	return (
		<div>
			<div className="w-full h-[750px]">
				<PDFViewer style={{ width: '100%', height: '100%' }}>
					<TimesheetDoc />
				</PDFViewer>
		  </div>
		</div>
	);
}
