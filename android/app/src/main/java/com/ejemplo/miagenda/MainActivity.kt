package com.ejemplo.miagenda

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Checkbox
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp

enum class Prioridad(val etiqueta: String, val color: Color) {
    BAJA("Baja", Color(0xFF047857)),
    MEDIA("Media", Color(0xFFB45309)),
    ALTA("Alta", Color(0xFFB91C1C))
}

data class Actividad(
    val id: Int,
    val titulo: String,
    val fecha: String = "",
    val prioridad: Prioridad = Prioridad.MEDIA,
    val completada: Boolean = false
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MiAgendaScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MiAgendaScreen() {
    // Estado en memoria: se conserva solo mientras la app esté abierta
    var textoActividad by remember { mutableStateOf("") }
    var fechaActividad by remember { mutableStateOf("") }
    var prioridadActividad by remember { mutableStateOf(Prioridad.MEDIA) }
    var mensajeError by remember { mutableStateOf("") }
    var textoBusqueda by remember { mutableStateOf("") }
    var siguienteId by remember { mutableIntStateOf(1) }
    val actividades = remember { mutableStateListOf<Actividad>() }

    // Lista filtrada en tiempo real por nombre
    val actividadesFiltradas = if (textoBusqueda.isBlank()) {
        actividades
    } else {
        actividades.filter {
            it.titulo.contains(textoBusqueda.trim(), ignoreCase = true)
        }
    }

    // Actividad seleccionada para editar (null si no se está editando ninguna)
    var actividadEnEdicion by remember { mutableStateOf<Actividad?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(text = "Mi Agenda") }
            )
        }
    ) { paddingInterno ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingInterno)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // 1. Campos para escribir una nueva actividad, fecha y prioridad
            OutlinedTextField(
                value = textoActividad,
                onValueChange = {
                    textoActividad = it
                    mensajeError = if (it.isNotEmpty() && it.isBlank()) {
                        "Debes escribir una actividad."
                    } else {
                        ""
                    }
                },
                label = { Text("Escribe una actividad") },
                isError = mensajeError.isNotEmpty(),
                supportingText = if (mensajeError.isNotEmpty()) {
                    { Text(text = mensajeError) }
                } else {
                    null
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            OutlinedTextField(
                value = fechaActividad,
                onValueChange = { fechaActividad = it },
                label = { Text("Fecha (ej. 25/11/2026)") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            SelectorPrioridad(
                seleccionada = prioridadActividad,
                onSeleccionar = { prioridadActividad = it }
            )

            // 2. Botón para agregar la actividad a la lista
            Button(
                onClick = {
                    val tituloLimpio = textoActividad.trim()
                    if (tituloLimpio.isEmpty()) {
                        mensajeError = "Debes escribir una actividad."
                    } else {
                        actividades.add(
                            Actividad(
                                id = siguienteId,
                                titulo = tituloLimpio,
                                fecha = fechaActividad.trim().ifEmpty { "Hoy" },
                                prioridad = prioridadActividad
                            )
                        )
                        siguienteId++
                        textoActividad = ""
                        fechaActividad = ""
                        prioridadActividad = Prioridad.MEDIA
                        mensajeError = ""
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp)
            ) {
                Text(text = "Agregar actividad")
            }

            // 3. Tarjeta de resumen de progreso encima de la lista
            ResumenProgresoCard(
                total = actividades.size,
                completadas = actividades.count { it.completada }
            )

            // 4. Barra de búsqueda en la parte superior de la lista
            OutlinedTextField(
                value = textoBusqueda,
                onValueChange = { textoBusqueda = it },
                label = { Text("Buscar actividad por nombre") },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Buscar"
                    )
                },
                trailingIcon = {
                    if (textoBusqueda.isNotEmpty()) {
                        IconButton(onClick = { textoBusqueda = "" }) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "Limpiar búsqueda"
                            )
                        }
                    }
                },
                singleLine = true,
                modifier = Modifier.fillMaxWidth()
            )

            // 5. Lista de actividades filtradas o mensaje según el estado
            if (actividadesFiltradas.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (actividades.isEmpty()) {
                            "No hay actividades todavía. Escribe una arriba para empezar."
                        } else {
                            "No se encontraron actividades con ese nombre."
                        },
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier
                        .fillMaxWidth()
                        .weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(
                        items = actividadesFiltradas,
                        key = { it.id }
                    ) { actividad ->
                        ActividadItem(
                            actividad = actividad,
                            onToggleCompletada = {
                                val index = actividades.indexOfFirst { it.id == actividad.id }
                                if (index != -1) {
                                    actividades[index] = actividad.copy(
                                        completada = !actividad.completada
                                    )
                                }
                            },
                            onEditar = {
                                actividadEnEdicion = actividad
                            },
                            onEliminar = {
                                actividades.removeAll { it.id == actividad.id }
                            }
                        )
                    }
                }
            }
        }

        // 6. Formulario sencillo para editar nombre, fecha y prioridad
        actividadEnEdicion?.let { actividad ->
            EditarActividadDialog(
                actividad = actividad,
                onGuardar = { nuevoTitulo, nuevaFecha, nuevaPrioridad ->
                    val index = actividades.indexOfFirst { it.id == actividad.id }
                    if (index != -1) {
                        actividades[index] = actividad.copy(
                            titulo = nuevoTitulo,
                            fecha = nuevaFecha.ifEmpty { "Hoy" },
                            prioridad = nuevaPrioridad
                        )
                    }
                    actividadEnEdicion = null
                },
                onCancelar = {
                    actividadEnEdicion = null
                }
            )
        }
    }
}

@Composable
fun SelectorPrioridad(
    seleccionada: Prioridad,
    onSeleccionar: (Prioridad) -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(
            text = "Prioridad",
            style = MaterialTheme.typography.labelLarge
        )
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Prioridad.entries.forEach { prioridad ->
                val esSeleccionada = prioridad == seleccionada
                if (esSeleccionada) {
                    Button(
                        onClick = { onSeleccionar(prioridad) },
                        colors = ButtonDefaults.buttonColors(containerColor = prioridad.color),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(text = prioridad.etiqueta)
                    }
                } else {
                    OutlinedButton(
                        onClick = { onSeleccionar(prioridad) },
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(text = prioridad.etiqueta)
                    }
                }
            }
        }
    }
}

@Composable
fun ResumenProgresoCard(
    total: Int,
    completadas: Int
) {
    val progreso = if (total == 0) 0f else completadas.toFloat() / total
    val porcentaje = (progreso * 100).toInt()

    OutlinedCard(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Progreso: $completadas de $total completadas",
                    style = MaterialTheme.typography.bodyMedium
                )
                Text(
                    text = "$porcentaje%",
                    style = MaterialTheme.typography.titleSmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            LinearProgressIndicator(
                progress = { progreso },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
            )
        }
    }
}

@Composable
fun ActividadItem(
    actividad: Actividad,
    onToggleCompletada: () -> Unit,
    onEditar: () -> Unit,
    onEliminar: () -> Unit
) {
    OutlinedCard(
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Control para marcar como completada
            Checkbox(
                checked = actividad.completada,
                onCheckedChange = { onToggleCompletada() }
            )

            // Nombre, fecha y prioridad visual de la actividad
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 8.dp)
            ) {
                Text(
                    text = "${actividad.titulo} · ${actividad.fecha.ifBlank { "Hoy" }}",
                    style = MaterialTheme.typography.bodyLarge,
                    textDecoration = if (actividad.completada) {
                        TextDecoration.LineThrough
                    } else {
                        TextDecoration.None
                    },
                    color = if (actividad.completada) {
                        MaterialTheme.colorScheme.onSurfaceVariant
                    } else {
                        MaterialTheme.colorScheme.onSurface
                    }
                )
                Text(
                    text = "Prioridad ${actividad.prioridad.etiqueta}",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = actividad.prioridad.color
                )
            }

            // Botón para editar nombre, fecha y prioridad
            IconButton(onClick = onEditar) {
                Icon(
                    imageVector = Icons.Default.Edit,
                    contentDescription = "Editar actividad",
                    tint = MaterialTheme.colorScheme.primary
                )
            }

            // Botón para eliminar la actividad
            IconButton(onClick = onEliminar) {
                Icon(
                    imageVector = Icons.Default.Delete,
                    contentDescription = "Eliminar actividad",
                    tint = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}

@Composable
fun EditarActividadDialog(
    actividad: Actividad,
    onGuardar: (String, String, Prioridad) -> Unit,
    onCancelar: () -> Unit
) {
    var nuevoTitulo by remember(actividad.id) { mutableStateOf(actividad.titulo) }
    var nuevaFecha by remember(actividad.id) { mutableStateOf(actividad.fecha) }
    var nuevaPrioridad by remember(actividad.id) { mutableStateOf(actividad.prioridad) }

    AlertDialog(
        onDismissRequest = onCancelar,
        title = { Text(text = "Editar actividad") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = nuevoTitulo,
                    onValueChange = { nuevoTitulo = it },
                    label = { Text("Nombre de la actividad") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = nuevaFecha,
                    onValueChange = { nuevaFecha = it },
                    label = { Text("Fecha (ej. 25/11/2026)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                SelectorPrioridad(
                    seleccionada = nuevaPrioridad,
                    onSeleccionar = { nuevaPrioridad = it }
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val tituloLimpio = nuevoTitulo.trim()
                    if (tituloLimpio.isNotEmpty()) {
                        onGuardar(tituloLimpio, nuevaFecha.trim(), nuevaPrioridad)
                    }
                }
            ) {
                Text("Guardar")
            }
        },
        dismissButton = {
            TextButton(onClick = onCancelar) {
                Text("Cancelar")
            }
        }
    )
}

@Preview(showBackground = true)
@Composable
fun MiAgendaPreview() {
    MaterialTheme {
        MiAgendaScreen()
    }
}
